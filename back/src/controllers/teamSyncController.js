import { syncTeamByApiId, syncTeamsByLeagueSeason } from "../services/teamSyncService.js";
import {
    getRequestedSeasons,
    parsePositiveInteger,
    supportedSyncSeasons,
} from "../utils/syncSeasons.js";

const syncTeams = async (req, res) => {
    try {
        const { league: leagueQuery, season: seasonQuery, allSeasons: allSeasonsQuery } = req.query;

        if (!leagueQuery) {
            return res.status(400).json({
                message: "league query is required",
                example: "/api/admin/sync/teams?league=39",
            });
        }

        const league = parsePositiveInteger(leagueQuery);

        if (!league) {
            return res.status(400).json({
                message: "Invalid league. Use a positive league id",
            });
        }

        const { seasons, error } = getRequestedSeasons({
            seasonQuery,
            allSeasonsQuery,
            defaultToAll: true,
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
                const result = await syncTeamsByLeagueSeason(league, season);

                results.push({
                    league,
                    season,
                    count: result.count,
                    status: "success",
                    message: result.count === 0
                        ? "No teams found for this league and season"
                        : "Teams synced successfully",
                });
            } catch (err) {
                results.push({
                    league,
                    season,
                    count: 0,
                    status: "failed",
                    error_message: err.message,
                });
            }
        }

        const successCount = results.filter((result) => result.status === "success").length;
        const failedCount = results.length - successCount;
        const totalCount = results.reduce((total, result) => total + result.count, 0);
        const message = successCount === 0
            ? "Failed to sync teams"
            : failedCount > 0
                ? `Teams synced for ${successCount} of ${results.length} seasons`
                : totalCount === 0
                    ? "No teams found for the selected seasons"
                    : "Teams synced successfully";

        return res.status(successCount === 0 ? 500 : 200).json({
            message,
            source: "api_football_admin_sync",
            league,
            season: seasons.length === 1 ? seasons[0] : undefined,
            seasons,
            count: totalCount,
            total_count: totalCount,
            results,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync teams",
            error: err.message,
        });
    }
};

const syncTeam = async (req, res) => {
    try {
        const teamApiId = parsePositiveInteger(req.params.teamApiId);

        if (!teamApiId) {
            return res.status(400).json({
                message: "Invalid teamApiId. Use a positive API team id",
                example: "/api/admin/sync/teams/541",
            });
        }

        const result = await syncTeamByApiId(teamApiId);

        if (result.count === 0) {
            return res.status(404).json({
                message: "No team found for this API team id",
                source: "api_football_admin_sync",
                teamApiId,
                count: 0,
                results: [
                    {
                        teamApiId,
                        count: 0,
                        status: "failed",
                        message: "No team found for this API team id",
                    },
                ],
            });
        }

        return res.status(200).json({
            message: "Team synced successfully",
            source: "api_football_admin_sync",
            teamApiId,
            count: result.count,
            team: {
                id: result.team.id,
                api_team_id: result.team.api_team_id,
                name: result.team.name,
                country: result.team.country,
                logo: result.team.logo,
            },
            results: [
                {
                    teamApiId,
                    count: result.count,
                    status: "success",
                    message: "Team synced successfully",
                },
            ],
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync team",
            error: err.message,
        });
    }
};

export { syncTeam, syncTeams };
