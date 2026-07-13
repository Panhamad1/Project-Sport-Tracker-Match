import { syncPlayerByIdSeason, syncPlayersByTeamSeason } from "../services/playerSyncService.js";
import {
    getRequestedSeasons,
    parsePositiveInteger,
    supportedSyncSeasons,
} from "../utils/syncSeasons.js";

const getTeamPlayerMessage = (result) => {
    if (result.players_count === 0) {
        return "No players found for this team and season";
    }

    return result.stopped_early
        ? "Players partially synced. API plan only allows the first 3 pages."
        : "Players synced successfully";
};

const getSinglePlayerMessage = (result) => {
    if (result.players_count === 0) {
        return "No player found for this id and season";
    }

    return result.stopped_early
        ? "Player partially synced. API plan only allows the first 3 pages."
        : "Player synced successfully";
};

const syncPlayers = async (req, res) => {
    try {
        const {
            teamApiId: teamApiIdQuery,
            season: seasonQuery,
            allSeasons: allSeasonsQuery,
        } = req.query;

        if (!teamApiIdQuery) {
            return res.status(400).json({
                message: "teamApiId query is required",
                example: "/api/admin/sync/players?teamApiId=541&season=2024",
            });
        }

        const teamApiId = parsePositiveInteger(teamApiIdQuery);

        if (!teamApiId) {
            return res.status(400).json({
                message: "Invalid teamApiId. Use a positive API team id",
            });
        }

        const { seasons, error } = getRequestedSeasons({
            seasonQuery,
            allSeasonsQuery,
            defaultToAll: false,
        });

        if (error) {
            return res.status(400).json({
                message: error,
                allowed_seasons: supportedSyncSeasons,
            });
        }

        const results = [];

        for (const season of seasons) {
            try {
                const result = await syncPlayersByTeamSeason({
                    teamApiId,
                    season,
                });

                results.push({
                    ...result,
                    status: "success",
                    message: getTeamPlayerMessage(result),
                });
            } catch (err) {
                results.push({
                    teamApiId,
                    season,
                    players_count: 0,
                    statistics_count: 0,
                    leagues_count: 0,
                    leagues_synced: [],
                    status: "failed",
                    error_message: err.message,
                });
            }
        }

        const successCount = results.filter((result) => result.status === "success").length;
        const failedCount = results.length - successCount;
        const playersCount = results.reduce((total, result) => total + (result.players_count || 0), 0);
        const statisticsCount = results.reduce((total, result) => total + (result.statistics_count || 0), 0);
        const stoppedEarly = results.some((result) => result.stopped_early);
        const message = successCount === 0
            ? "Failed to sync players"
            : failedCount > 0
                ? `Players synced for ${successCount} of ${results.length} seasons`
                : playersCount === 0
                    ? "No players found for the selected seasons"
                    : stoppedEarly
                        ? "Players partially synced. API plan only allows the first 3 pages."
                        : "Players synced successfully";

        return res.status(successCount === 0 ? 500 : 200).json({
            message,
            source: "api_football_admin_sync",
            teamApiId,
            season: seasons.length === 1 ? seasons[0] : undefined,
            seasons,
            players_count: playersCount,
            statistics_count: statisticsCount,
            stopped_early: stoppedEarly,
            results,
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
        const playerApiId = parsePositiveInteger(req.params.playerApiId);
        const { season: seasonQuery, allSeasons: allSeasonsQuery } = req.query;

        if (!playerApiId) {
            return res.status(400).json({
                message: "Invalid playerApiId. Use a positive API player id",
            });
        }

        const { seasons, error } = getRequestedSeasons({
            seasonQuery,
            allSeasonsQuery,
            defaultToAll: false,
        });

        if (error) {
            return res.status(400).json({
                message: error,
                allowed_seasons: supportedSyncSeasons,
            });
        }

        const results = [];

        for (const season of seasons) {
            try {
                const result = await syncPlayerByIdSeason({
                    playerApiId,
                    season,
                });

                results.push({
                    ...result,
                    status: "success",
                    message: getSinglePlayerMessage(result),
                });
            } catch (err) {
                results.push({
                    playerApiId,
                    season,
                    players_count: 0,
                    statistics_count: 0,
                    teams_count: 0,
                    teams_synced: [],
                    leagues_count: 0,
                    leagues_synced: [],
                    status: "failed",
                    error_message: err.message,
                });
            }
        }

        const successCount = results.filter((result) => result.status === "success").length;
        const failedCount = results.length - successCount;
        const playersCount = results.reduce((total, result) => total + (result.players_count || 0), 0);
        const statisticsCount = results.reduce((total, result) => total + (result.statistics_count || 0), 0);
        const stoppedEarly = results.some((result) => result.stopped_early);
        const message = successCount === 0
            ? "Failed to sync player"
            : failedCount > 0
                ? `Player synced for ${successCount} of ${results.length} seasons`
                : playersCount === 0
                    ? "No player found for the selected seasons"
                    : stoppedEarly
                        ? "Player partially synced. API plan only allows the first 3 pages."
                        : "Player synced successfully";

        return res.status(successCount === 0 ? 500 : 200).json({
            message,
            source: "api_football_admin_sync",
            playerApiId,
            season: seasons.length === 1 ? seasons[0] : undefined,
            seasons,
            players_count: playersCount,
            statistics_count: statisticsCount,
            stopped_early: stoppedEarly,
            results,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync player",
            error: err.message,
        });
    }
};

export { syncPlayer, syncPlayers };
