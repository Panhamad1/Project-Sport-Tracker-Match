import { syncTeamsByLeagueSeason } from "../services/teamSyncService.js";

const syncTeams = async (req, res) => {
    try {
        const { league: leagueQuery, season: seasonQuery } = req.query;

        if (!leagueQuery || !seasonQuery) {
            return res.status(400).json({
                message: "league and season query are required",
                example: "/api/admin/sync/teams?league=1&season=2026",
            });
        }

        const league = Number(leagueQuery);
        const season = Number(seasonQuery);

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

        const result = await syncTeamsByLeagueSeason(league, season);

        return res.status(200).json({
            message: result.count === 0 ? "No teams found for this league and season" : "Teams synced successfully",
            source: "api_football_admin_sync",
            league,
            season,
            count: result.count,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync teams",
            error: err.message,
        });
    }
};

export { syncTeams };
