import { League, LeagueStanding, Team } from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";

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

const saveOrUpdateStanding = async ({ league, team, season, apiStanding }) => {
    const values = {
        league_id: league.id,
        team_id: team.id,
        season,
        rank: apiStanding.rank ?? null,
        points: apiStanding.points ?? null,
        goals_diff: apiStanding.goalsDiff ?? null,
        group_name: apiStanding.group || null,
        form: apiStanding.form || null,
        status: apiStanding.status || null,
        description: apiStanding.description || null,
        played: apiStanding.all?.played ?? null,
        win: apiStanding.all?.win ?? null,
        draw: apiStanding.all?.draw ?? null,
        lose: apiStanding.all?.lose ?? null,
        goals_for: apiStanding.all?.goals?.for ?? null,
        goals_against: apiStanding.all?.goals?.against ?? null,
        raw_data: apiStanding,
        last_updated: new Date(),
    };

    const [standing, created] = await LeagueStanding.findOrCreate({
        where: {
            league_id: league.id,
            team_id: team.id,
            season,
        },
        defaults: values,
    });

    if (!created) {
        await standing.update(values);
    }

    return standing;
};

const syncStandingsByLeagueSeason = async ({ league, season }) => {
    const apiData = await apiFootballGet("/standings", {
        league,
        season,
    });

    const apiLeagueData = apiData.response?.[0]?.league;

    if (!apiLeagueData) {
        return {
            league,
            season,
            count: 0,
        };
    }

    const localLeague = await saveOrUpdateLeague(apiLeagueData);
    const standingGroups = apiLeagueData.standings || [];
    let savedCount = 0;

    for (const standingGroup of standingGroups) {
        for (const apiStanding of standingGroup) {
            const team = await saveOrUpdateTeam(apiStanding.team);
            await saveOrUpdateStanding({
                league: localLeague,
                team,
                season,
                apiStanding,
            });
            savedCount += 1;
        }
    }

    return {
        league,
        season,
        count: savedCount,
    };
};

export { syncStandingsByLeagueSeason };
