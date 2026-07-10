import { syncStandingsByLeagueSeason } from "../services/standingSyncService.js";

const syncStandings = async (req, res) => {
    try {
        const { league: leagueQuery, season: seasonQuery } = req.query;

        if (!leagueQuery || !seasonQuery) {
            return res.status(400).json({
                message: "league and season query are required",
                example: "/api/admin/sync/standings?league=39&season=2024",
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

        const result = await syncStandingsByLeagueSeason({
            league,
            season,
        });

        return res.status(200).json({
            message: result.count === 0 ? "No standings found for this league and season" : "Standings synced successfully",
            source: "api_football_admin_sync",
            league,
            season,
            count: result.count,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync standings",
            error: err.message,
        });
    }
};

export { syncStandings };
