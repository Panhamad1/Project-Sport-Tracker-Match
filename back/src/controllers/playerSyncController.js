import { syncPlayersByTeamLeagueSeason } from "../services/playerSyncService.js";

const MIN_API_FOOTBALL_FREE_SEASON = 2022;
const MAX_API_FOOTBALL_FREE_SEASON = 2024;

const syncPlayers = async (req, res) => {
    try {
        const { teamApiId: teamApiIdQuery, league: leagueQuery, season: seasonQuery } = req.query;

        if (!teamApiIdQuery || !leagueQuery || !seasonQuery) {
            return res.status(400).json({
                message: "teamApiId, league, and season query are required",
                example: "/api/admin/sync/players?teamApiId=10&league=1&season=2024",
            });
        }

        const teamApiId = Number(teamApiIdQuery);
        const league = Number(leagueQuery);
        const season = Number(seasonQuery);

        if (!Number.isInteger(teamApiId) || teamApiId <= 0) {
            return res.status(400).json({
                message: "Invalid teamApiId. Use a positive API team id",
            });
        }

        if (!Number.isInteger(league) || league <= 0) {
            return res.status(400).json({
                message: "Invalid league. Use a positive league id",
            });
        }

        if (!Number.isInteger(season) || season <= 0) {
            return res.status(400).json({
                message: "Invalid season. Use a positive year",
            });
        }

        if (season < MIN_API_FOOTBALL_FREE_SEASON || season > MAX_API_FOOTBALL_FREE_SEASON) {
            return res.status(400).json({
                message: "This API-FOOTBALL plan only supports seasons from 2022 to 2024",
                allowed_seasons: {
                    from: MIN_API_FOOTBALL_FREE_SEASON,
                    to: MAX_API_FOOTBALL_FREE_SEASON,
                },
            });
        }

        const result = await syncPlayersByTeamLeagueSeason({
            teamApiId,
            league,
            season,
        });

        return res.status(200).json({
            message: result.players_count === 0 ? "No players found for this team, league, and season" : "Players synced successfully",
            source: "api_football_admin_sync",
            teamApiId,
            league,
            season,
            players_count: result.players_count,
            statistics_count: result.statistics_count,
            pages_synced: result.pages_synced,
            total_pages: result.total_pages,
            stopped_early: result.stopped_early,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync players",
            error: err.message,
        });
    }
};

export { syncPlayers };
