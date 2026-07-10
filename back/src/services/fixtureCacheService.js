import { Op } from "sequelize";
import {
  League,
  Team,
  Fixture,
  FixtureSyncLog,
} from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";
import {
    CAMBODIA_TIMEZONE,
    getCambodiaDateRange,
    getCambodiaDateTimeFields,
} from "../utils/cambodiaTime.js";

// this will use admin for sync data and normal user only make request to database
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
const allowLeagueIds = [1,2];
const isLeagueAllowed = (apiLeagueId)=>{
    //ber allowleague like have nothing like this [] it mean we save every league 
    if(allowLeagueIds.length === 0){
        return true;
    }
    return allowLeagueIds.includes(Number(apiLeagueId));
}

const findFixturesFromDatabase = async (date) => {
    const { startDate, endDate } = getCambodiaDateRange(date);

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
    const fixtures = await Fixture.findAll({
      where: {
        match_date: {
                [Op.between]: [startDate, endDate],
            },
        },
        include: [
            leagueInclude,
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

const formatFixtureForResponse = (fixture) => {
    const fixtureData = fixture.toJSON();

    return {
        ...fixtureData,
        ...getCambodiaDateTimeFields(fixtureData.match_date),
    };
};

const getFixturesByDateFromDatabaseOnly = async (date) => {
    if(!isValidDate(date)){
        throw new Error("Invalid Date format. Use YYYY-MM-DD");
    }   
    const fixtures = await findFixturesFromDatabase(date);
    const formattedFixtures = fixtures.map(formatFixtureForResponse);

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
const fetchAndSaveFixturesFromApi = async (date) => {
    const timezone = process.env.API_FOOTBALL_TIMEZONE || "Asia/Phnom_Penh";

    const apiData = await apiFootballGet("/fixtures", {
        date,
        timezone,
    });
    const apiFixtures = apiData.response || [];
    const fixtures = apiFixtures.filter((fixture) => isLeagueAllowed(fixture.league?.id));
    console.log(`API fixtures: ${apiFixtures.length}, saved after filter: ${fixtures.length}`);

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
            const savedCount = await fetchAndSaveFixturesFromApi(currentDate);
            results.push({
                date: currentDate,
                status: "success",
                source: "api_football_admin_sync",
                count: savedCount,
                message: savedCount === 0 ? "No fixtures found for this date" : "fixtures sync from api and save to database",
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
    getFixturesByDateFromDatabaseOnly,
    syncFixturesByDateRange,
};
