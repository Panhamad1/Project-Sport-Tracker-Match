import { syncPlayerByIdSeason, syncPlayersByTeamSeason } from "../services/playerSyncService.js";

const MIN_API_FOOTBALL_FREE_SEASON = 2022;
const MAX_API_FOOTBALL_FREE_SEASON = 2024;

const syncPlayers = async (req, res) => {
    try {
        const { teamApiId: teamApiIdQuery, season: seasonQuery } = req.query;

        if (!teamApiIdQuery || !seasonQuery) {
            return res.status(400).json({
                message: "teamApiId and season query are required",
                example: "/api/admin/sync/players?teamApiId=541&season=2024",
            });
        }

        const teamApiId = Number(teamApiIdQuery);
        const season = Number(seasonQuery);

        if (!Number.isInteger(teamApiId) || teamApiId <= 0) {
            return res.status(400).json({
                message: "Invalid teamApiId. Use a positive API team id",
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

        const result = await syncPlayersByTeamSeason({
            teamApiId,
            season,
        });

        const message = result.players_count === 0
            ? "No players found for this team and season"
            : result.stopped_early
                ? "Players partially synced. API plan only allows the first 3 pages."
                : "Players synced successfully";

        return res.status(200).json({
            message,
            source: "api_football_admin_sync",
            teamApiId,
            season,
            players_count: result.players_count,
            statistics_count: result.statistics_count,
            leagues_count: result.leagues_count,
            leagues_synced: result.leagues_synced,
            pages_synced: result.pages_synced,
            total_pages: result.total_pages,
            stopped_early: result.stopped_early,
            max_pages_allowed: result.max_pages_allowed,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync players",
            error: err.message,
        });
    }
};

const syncPlayer = async (req, res) => {
    try {
        const playerApiId = Number(req.params.playerApiId);
        const season = Number(req.query.season);

        if (!Number.isInteger(playerApiId) || playerApiId <= 0) {
            return res.status(400).json({
                message: "Invalid playerApiId. Use a positive API player id",
            });
        }

        if (!Number.isInteger(season) || season <= 0) {
            return res.status(400).json({
                message: "season query is required. Use a positive year",
                example: "/api/admin/sync/players/874?season=2024",
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

        const result = await syncPlayerByIdSeason({
            playerApiId,
            season,
        });

        const message = result.players_count === 0
            ? "No player found for this id and season"
            : result.stopped_early
                ? "Player partially synced. API plan only allows the first 3 pages."
                : "Player synced successfully";

        return res.status(200).json({
            message,
            source: "api_football_admin_sync",
            playerApiId,
            season,
            players_count: result.players_count,
            statistics_count: result.statistics_count,
            teams_count: result.teams_count,
            teams_synced: result.teams_synced,
            leagues_count: result.leagues_count,
            leagues_synced: result.leagues_synced,
            pages_synced: result.pages_synced,
            total_pages: result.total_pages,
            stopped_early: result.stopped_early,
            max_pages_allowed: result.max_pages_allowed,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync player",
            error: err.message,
        });
    }
};

export { syncPlayer, syncPlayers };
