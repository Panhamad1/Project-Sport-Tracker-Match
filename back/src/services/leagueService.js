import { League, LeagueStanding, Team } from "../models/index.js";

const getLeagueStandingsFromDatabaseOnly = async ({ league, season }) => {
    const localLeague = await League.findOne({
        where: {
            api_league_id: league,
            season,
        },
        include: [
            {
                model: LeagueStanding,
                as: "standings",
                include: [
                    {
                        model: Team,
                        as: "team",
                    },
                ],
            },
        ],
        order: [[{ model: LeagueStanding, as: "standings" }, "rank", "ASC"]],
    });

    return {
        source: "database_only",
        league: localLeague,
        standings: localLeague?.standings || [],
        apiRequestUsed: false,
    };
};

export { getLeagueStandingsFromDatabaseOnly };
