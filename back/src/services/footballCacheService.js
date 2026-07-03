import { Op } from "sequelize";
import {
  League,
  Team,
  Fixture,
  FixtureSyncLog,
} from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";

// This prevents many users requesting the same empty date at the same time
// and causing many API calls.
// 1. Users keep requesting dates with no matches
// 2. Many users request same date at same time
// 3. API failed but backend keeps retrying again and again
const runningDateSyncs = new Map();
const sleep = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const isValidDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const getDateRange = (date) => {
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    return { startDate, endDate };
};

const getNextDate = (date) => {
    const currentDate = new Date(`${date}T00:00:00.000Z`);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);

    return currentDate.toISOString().slice(0, 10);
};

const getDaysCount = (from, to) => {
    const startDate = new Date(`${from}T00:00:00.000Z`);
    const endDate = new Date(`${to}T00:00:00.000Z`);

    const diffTime = endDate - startDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays + 1;
};

const findFixturesFromDatabase = async (date) => {
    const { startDate, endDate } = getDateRange(date);

    const fixtures = await Fixture.findAll({
      where: {
        match_date: {
                [Op.between]: [startDate, endDate],
            },
        },
        include: [
            {
                model: League,
                as: "league",
            },
            {
                model: Team,
                as: "homeTeam",
            },
            {
                model: Team,
                as: "awayTeam",
            },
        ],
        order: [["match_date", "ASC"]],
    });

    return fixtures;
};

const findFixtureSyncLog = async (date) => {
    const syncLog = await FixtureSyncLog.findOne({
      where: {
        sync_date: date,
      },
    });

    return syncLog;
};

const isFailedLogFresh = (syncLog) => {
    if (!syncLog || syncLog.status !== "failed") return false;

    const retryMinutes = Number(process.env.FAILED_SYNC_RETRY_MINUTES) || 60;

    const lastSyncedTime = new Date(syncLog.last_synced_at).getTime();
    const now = Date.now();

    const diffMinutes = (now - lastSyncedTime) / 1000 / 60;

    return diffMinutes < retryMinutes;
};

const saveOrUpdateSyncLog = async ({date,status,fixtureCount = 0,errorMessage = null,}) => {
    const values = {
        sync_date: date,
        status,
        fixture_count: fixtureCount,
        error_message: errorMessage,
        last_synced_at: new Date(),
    };

    const [syncLog, created] = await FixtureSyncLog.findOrCreate({
        where: {
          sync_date: date,
        },
        defaults: values,
    });

    if (!created) {
        await syncLog.update(values);
    }

    return syncLog;
};

const saveOrUpdateLeague = async (apiLeague) => {
    const values = {
        api_league_id: apiLeague.id,
        name: apiLeague.name,
        type: null,
        logo: apiLeague.logo || null,
        country: apiLeague.country || null,
        season: apiLeague.season,
        raw_data: apiLeague,
        last_updated: new Date(),
    };

    const [league, created] = await League.findOrCreate({
        where: {
          api_league_id: apiLeague.id,
          season: apiLeague.season,
        },
        defaults: values,
    });

    if (!created) {
        await league.update(values);
    }

    return league;
};

const saveOrUpdateTeam = async (apiTeam) => {
    const values = {
        api_team_id: apiTeam.id,
        name: apiTeam.name,
        code: null,
        country: null,
        founded: null,
        logo: apiTeam.logo || null,
        venue_name: null,
        venue_city: null,
        raw_data: apiTeam,
        last_updated: new Date(),
    };

    const [team, created] = await Team.findOrCreate({
        where: {
          api_team_id: apiTeam.id,
        },
        defaults: values,
    });

    if (!created) {
        await team.update(values);
    }

    return team;
};

const saveOrUpdateFixture = async (apiFixtureData) => {
    const apiLeague = apiFixtureData.league;
    const apiHomeTeam = apiFixtureData.teams.home;
    const apiAwayTeam = apiFixtureData.teams.away;

    const league = await saveOrUpdateLeague(apiLeague);
    const homeTeam = await saveOrUpdateTeam(apiHomeTeam);
    const awayTeam = await saveOrUpdateTeam(apiAwayTeam);

    const values = {
        api_fixture_id: apiFixtureData.fixture.id,
        league_id: league.id,
        season: apiLeague.season,
        home_team_id: homeTeam.id,
        away_team_id: awayTeam.id,
        match_date: apiFixtureData.fixture.date,
        status_long: apiFixtureData.fixture.status?.long || null,
        status_short: apiFixtureData.fixture.status?.short || null,
        elapsed: apiFixtureData.fixture.status?.elapsed || null,
        home_goals: apiFixtureData.goals?.home ?? null,
        away_goals: apiFixtureData.goals?.away ?? null,
        venue_name: apiFixtureData.fixture.venue?.name || null,
        venue_city: apiFixtureData.fixture.venue?.city || null,
        raw_data: apiFixtureData,
        last_updated: new Date(),
    };

    const [fixture, created] = await Fixture.findOrCreate({
        where: {
          api_fixture_id: apiFixtureData.fixture.id,
        },
        defaults: values,
    });

    if (!created) {
        await fixture.update(values);
    }

    return fixture;
};
const isEmptySuccessLogFresh = (syncLog) => {
    if (!syncLog) return false;
    if (syncLog.status !== "success") return false;
    if (syncLog.fixture_count !== 0) return false;

    const emptyCacheHours = Number(process.env.EMPTY_FIXTURE_CACHE_HOURS) || 12;

    const lastSyncedTime = new Date(syncLog.last_synced_at).getTime();
    const now = Date.now();

    const diffHours = (now - lastSyncedTime) / 1000 / 60 / 60;

    return diffHours < emptyCacheHours;
};

const fetchAndSaveFixturesFromApi = async (date) => {
    const timezone = process.env.API_FOOTBALL_TIMEZONE || "Asia/Phnom_Penh";

    const apiData = await apiFootballGet("/fixtures", {
        date,
        timezone,
    });

    const fixtures = apiData.response || [];

    for (const fixture of fixtures) {
        await saveOrUpdateFixture(fixture);
    }

    await saveOrUpdateSyncLog({
        date,
        status: "success",
        fixtureCount: fixtures.length,
        errorMessage: null,
    });

    return fixtures.length;
};

const getFixturesByDateCachedInternal = async (date) => {
    const databaseFixtures = await findFixturesFromDatabase(date);

    if (databaseFixtures.length > 0) {
        return {
            status: "success",
            source: "database_cache",
            message: "Fixtures loaded from database",
            count: databaseFixtures.length,
            fixtures: databaseFixtures,
            apiRequestUsed: false,
        };
    }

    const syncLog = await findFixtureSyncLog(date);

    if (isEmptySuccessLogFresh(syncLog)) {
        return {
            status: "success",
            source: "database_empty_cache",
            message: "No fixtures found for this date",
            count: 0,
            fixtures: [],
            apiRequestUsed: false,
        };
    }

    if (syncLog?.status === "failed" && isFailedLogFresh(syncLog)) {
        return {
            status: "failed",
            source: "database_failed_cache",
            message: "Fixture sync recently failed. Try again later.",
            count: 0,
            fixtures: [],
            error_message: syncLog.error_message,
            apiRequestUsed: false,
        };
    }

    try {
        await fetchAndSaveFixturesFromApi(date);

        const updatedFixtures = await findFixturesFromDatabase(date);

        return {
            status: "success",
            source: "api_football_then_database",
            message:
              updatedFixtures.length === 0
                ? "No fixtures found for this date"
                : "Fixtures loaded from API and saved to database",
            count: updatedFixtures.length,
            fixtures: updatedFixtures,
            apiRequestUsed: true,
        };
    } catch (error) {
        await saveOrUpdateSyncLog({
            date,
            status: "failed",
            fixtureCount: 0,
            errorMessage: error.message,
        });

        return {
            status: "failed",
            source: "api_football_failed",
            message: "Failed to fetch fixtures from API-FOOTBALL",
            count: 0,
            fixtures: [],
            error_message: error.message,
            apiRequestUsed: true,
        };
    }
};

const getFixturesByDateCached = async (date) => {
    if (!isValidDate(date)) {
        throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    if (runningDateSyncs.has(date)) {
        return runningDateSyncs.get(date);
    }

    const syncPromise = getFixturesByDateCachedInternal(date).finally(() => {
        runningDateSyncs.delete(date);
    });

    runningDateSyncs.set(date, syncPromise);

    return syncPromise;
};

const syncFixturesByDateRange = async (from, to) => {
    if (!isValidDate(from) || !isValidDate(to)) {
        throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    const daysCount = getDaysCount(from, to);

    if (daysCount <= 0) {
        throw new Error("From date must be before or equal to to date");
    }

    if (daysCount > 14) {
        throw new Error("For safety, sync only maximum 14 days at one time");
    }

    const results = [];

    let currentDate = from;

    while (currentDate <= to) {
        const result = await getFixturesByDateCached(currentDate);

        results.push({
            date: currentDate,
            status: result.status,
            source: result.source,
            count: result.count,
            message:
            result.count === 0 && result.status === "success" ? "No fixtures found for this date" : result.message, error_message: result.error_message || null,
      });

        if (result.status === "failed" && result.apiRequestUsed) {
            break;
        }

        currentDate = getNextDate(currentDate);

        if (currentDate <= to && result.apiRequestUsed) {
            await sleep(7);
        }
    }

    return results;
};

export {
    getFixturesByDateCached,
    syncFixturesByDateRange,
};