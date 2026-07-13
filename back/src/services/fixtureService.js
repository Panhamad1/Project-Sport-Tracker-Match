import { Op } from "sequelize";
import {
  League,
  Team,
  Fixture,
  FixtureSyncLog,
} from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";
import { awardPredictionPointsService } from "./predictionService.js";
import {
    CAMBODIA_TIMEZONE,
    getCambodiaDateRange,
    getCambodiaDateTimeFields,
} from "../utils/cambodiaTime.js";

// Admin sync fetches API-FOOTBALL; public routes read database only.
const sleep = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const isValidDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
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
//kleng dak league alov dak tah world cup sen teh
const allowLeagueIds = [1,2,113,103,244];
const finishedStatusShortCodes = ["FT", "AET", "PEN"];
const isLeagueAllowed = (apiLeagueId)=>{
    //ber allowleague like have nothing like this [] it mean we save every league 
    if(allowLeagueIds.length === 0){
        return true;
    }
    return allowLeagueIds.includes(Number(apiLeagueId));
}

const buildLeagueInclude = () => {
    const leagueInclude = {
        model: League,
        as: "league",
    };

    if(allowLeagueIds.length > 0){
        leagueInclude.where = {
            api_league_id:{
                [Op.in]: allowLeagueIds,
            },
        };
        leagueInclude.required = true;
    };

    return leagueInclude;
};

const findFixturesFromDatabase = async (date) => {
    const { startDate, endDate } = getCambodiaDateRange(date);

    const fixtures = await Fixture.findAll({
      where: {
        match_date: {
                [Op.between]: [startDate, endDate],
            },
        },
        include: [
            buildLeagueInclude(),
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

const findFixturesFromDatabaseByDateRange = async ({ from, to, limit }) => {
    const { startDate } = getCambodiaDateRange(from);
    const { endDate } = getCambodiaDateRange(to);

    const fixtures = await Fixture.findAll({
        where: {
            match_date: {
                [Op.between]: [startDate, endDate],
            },
        },
        include: [
            buildLeagueInclude(),
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
        limit,
    });

    return fixtures;
};

const formatPublicLeague = (league) => {
    if(!league){
        return null;
    }

    return {
        api_league_id: league.api_league_id,
        name: league.name,
        type: league.type,
        logo: league.logo,
        country: league.country,
        season: league.season,
    };
};

const formatPublicTeam = (team) => {
    if(!team){
        return null;
    }

    return {
        api_team_id: team.api_team_id,
        name: team.name,
        code: team.code,
        country: team.country,
        logo: team.logo,
        venue_name: team.venue_name,
        venue_city: team.venue_city,
    };
};

const formatFixtureForResponse = (fixture, { exposeLocalIds = false } = {}) => {
    const fixtureData = fixture.toJSON();

    if(exposeLocalIds){
        return {
            ...fixtureData,
            ...getCambodiaDateTimeFields(fixtureData.match_date),
        };
    }

    return {
        public_match_id: fixtureData.api_fixture_id,
        api_fixture_id: fixtureData.api_fixture_id,
        season: fixtureData.season,
        match_date: fixtureData.match_date,
        status_long: fixtureData.status_long,
        status_short: fixtureData.status_short,
        elapsed: fixtureData.elapsed,
        home_goals: fixtureData.home_goals,
        away_goals: fixtureData.away_goals,
        venue_name: fixtureData.venue_name,
        venue_city: fixtureData.venue_city,
        league: formatPublicLeague(fixtureData.league),
        homeTeam: formatPublicTeam(fixtureData.homeTeam),
        awayTeam: formatPublicTeam(fixtureData.awayTeam),
        last_updated: fixtureData.last_updated,
        ...getCambodiaDateTimeFields(fixtureData.match_date),
    };
};

const getFixturesByDateFromDatabaseOnly = async (date, options = {}) => {
    if(!isValidDate(date)){
        throw new Error("Invalid Date format. Use YYYY-MM-DD");
    }   
    const fixtures = await findFixturesFromDatabase(date);
    const formattedFixtures = fixtures.map((fixture) => formatFixtureForResponse(fixture, options));

    return {
        status: "success",
        source: "database_only",
        timezone: CAMBODIA_TIMEZONE,
        message: formattedFixtures.length === 0 ? "No fixtures found in database for this date" : "Fixtures Loaded Success from database",
        count: formattedFixtures.length,
        fixtures: formattedFixtures,
        apiRequestUsed: false,
    }
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
        await team.update({
            name: apiTeam.name || team.name,
            logo: apiTeam.logo || team.logo,
            raw_data: apiTeam,
            last_updated: new Date(),
        });
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

const awardPredictionsForFinishedFixture = async (fixture) => {
    const statusShort = String(fixture.status_short || "").toUpperCase();

    if(!finishedStatusShortCodes.includes(statusShort)){
        return null;
    }

    if(fixture.home_goals === null || fixture.home_goals === undefined || fixture.away_goals === null || fixture.away_goals === undefined){
        return null;
    }

    try{
        return await awardPredictionPointsService(fixture.api_fixture_id);
    }catch(error){
        return {
            status: "failed",
            message: "Failed to award prediction points",
            error_message: error.message,
        };
    }
};

const getFixtureFeedFromDatabaseOnly = async ({ from, to, limit = 40 } = {}) => {
    if(!isValidDate(from) || !isValidDate(to)){
        throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    const daysCount = getDaysCount(from, to);

    if(daysCount <= 0){
        throw new Error("From date must be before or equal to to date");
    }

    if(daysCount > 31){
        throw new Error("Fixture feed can load maximum 31 days at one time");
    }

    const safeLimit = Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 40;
    const fixtures = await findFixturesFromDatabaseByDateRange({
        from,
        to,
        limit: safeLimit,
    });
    const formattedFixtures = fixtures.map((fixture) => formatFixtureForResponse(fixture));

    return {
        status: "success",
        source: "database_only",
        timezone: CAMBODIA_TIMEZONE,
        message: formattedFixtures.length === 0 ? "No fixtures found in database for this feed" : "Fixture feed loaded successfully",
        count: formattedFixtures.length,
        fixtures: formattedFixtures,
        apiRequestUsed: false,
    };
};

const fetchAndSaveFixturesFromApi = async (date) => {
    const timezone = process.env.API_FOOTBALL_TIMEZONE || "Asia/Phnom_Penh";

    const apiData = await apiFootballGet("/fixtures", {
        date,
        timezone,
    });
    const apiFixtures = apiData.response || [];
    const fixtures = apiFixtures.filter((fixture) => isLeagueAllowed(fixture.league?.id));
    console.log(`API fixtures: ${apiFixtures.length}, saved after filter: ${fixtures.length}`);

    const predictionAwards = [];

    for (const fixture of fixtures) {
        const savedFixture = await saveOrUpdateFixture(fixture);
        const awardResult = await awardPredictionsForFinishedFixture(savedFixture);

        if(awardResult){
            predictionAwards.push(awardResult);
        }
    }

    await saveOrUpdateSyncLog({
        date,
        status: "success",
        fixtureCount: fixtures.length,
        errorMessage: null,
    });

    return {
        savedCount: fixtures.length,
        predictionAwards,
    };
};

const syncFixtureById = async (fixtureId) => {
    const fixture = await Fixture.findByPk(fixtureId);

    if (!fixture) {
        return {
            status: "not_found",
            message: "Fixture not found in database",
        };
    }

    const apiData = await apiFootballGet("/fixtures", {
        id: fixture.api_fixture_id,
    });
    const apiFixtureData = apiData.response?.[0];

    if (!apiFixtureData) {
        return {
            status: "not_found",
            message: "Fixture not found from API-FOOTBALL",
            fixture_id: fixture.id,
            api_fixture_id: fixture.api_fixture_id,
        };
    }

    if (!isLeagueAllowed(apiFixtureData.league?.id)) {
        return {
            status: "skipped",
            message: "Fixture league is not allowed by current fixture filter",
            fixture_id: fixture.id,
            api_fixture_id: fixture.api_fixture_id,
            api_league_id: apiFixtureData.league?.id,
        };
    }

    const updatedFixture = await saveOrUpdateFixture(apiFixtureData);
    const predictionAward = await awardPredictionsForFinishedFixture(updatedFixture);

    return {
        status: "success",
        message: predictionAward?.newly_awarded > 0
            ? "Fixture refreshed and prediction points awarded successfully"
            : "Fixture refreshed successfully",
        fixture_id: updatedFixture.id,
        api_fixture_id: updatedFixture.api_fixture_id,
        status_short: updatedFixture.status_short,
        status_long: updatedFixture.status_long,
        elapsed: updatedFixture.elapsed,
        home_goals: updatedFixture.home_goals,
        away_goals: updatedFixture.away_goals,
        last_updated: updatedFixture.last_updated,
        prediction_award: predictionAward,
    };
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
        try{
            const syncResult = await fetchAndSaveFixturesFromApi(currentDate);
            const savedCount = syncResult.savedCount;
            const newlyAwarded = syncResult.predictionAwards.reduce((total, awardResult) => {
                return total + Number(awardResult.newly_awarded || 0);
            }, 0);

            results.push({
                date: currentDate,
                status: "success",
                source: "api_football_admin_sync",
                count: savedCount,
                message: newlyAwarded > 0
                    ? `Fixtures synced and ${newlyAwarded} prediction pick${newlyAwarded === 1 ? "" : "s"} awarded`
                    : savedCount === 0 ? "No fixtures found for this date" : "fixtures sync from api and save to database",
                prediction_awards: syncResult.predictionAwards,
                error_message: null,
            });
        }catch(error){
            await saveOrUpdateSyncLog({
                date: currentDate,
                status: "failed",
                fixtureCount: 0,
                errorMessage: error.message,
            });
            results.push({
                date: currentDate,
                status: "failed",
                source: "api_football_admin_sync_failed",
                count: 0,
                message: "Failed to sync fixtures from API-FOOTBALL",
                error_message: error.message,
            });
            break;
        }
        currentDate = getNextDate(currentDate);
        if(currentDate <= to){
            await sleep(1);
        }
    }
    return results;
};

export {
    getFixtureFeedFromDatabaseOnly,
    getFixturesByDateFromDatabaseOnly,
    syncFixtureById,
    syncFixturesByDateRange,
};
