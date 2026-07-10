import { Team } from "../models/index.js";
import { apiFootballGet } from "../providers/apiFootballProvider.js";

const saveOrUpdateTeam = async (apiTeamData) => {
    const apiTeam = apiTeamData.team;
    const venue = apiTeamData.venue || {};

    if (!apiTeam?.id || !apiTeam?.name) {
        return null;
    }

    const values = {
        api_team_id: apiTeam.id,
        name: apiTeam.name,
        code: apiTeam.code || null,
        country: apiTeam.country || null,
        founded: apiTeam.founded ?? null,
        logo: apiTeam.logo || null,
        venue_name: venue.name || null,
        venue_city: venue.city || null,
        raw_data: apiTeamData,
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

const syncTeamsByLeagueSeason = async (league, season) => {
    const apiData = await apiFootballGet("/teams", {
        league,
        season,
    });

    const apiTeams = apiData.response || [];
    let savedCount = 0;

    for (const apiTeamData of apiTeams) {
        const team = await saveOrUpdateTeam(apiTeamData);
        if (team) {
            savedCount += 1;
        }
    }

    return {
        league,
        season,
        count: savedCount,
    };
};

export { syncTeamsByLeagueSeason };
