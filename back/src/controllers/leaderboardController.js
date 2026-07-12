import { getLeaderboardService } from "../services/leaderboardService.js";

const getLeaderboard = async (req, res) => {
    try {
        const limit = Number(req.query.limit || 50);
        const leaderboard = await getLeaderboardService(limit);

        return res.status(200).json({
            message: leaderboard.length === 0 ? "No leaderboard data yet" : "Leaderboard loaded successfully",
            source: "database_only",
            count: leaderboard.length,
            leaderboard,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load leaderboard",
            error: error.message,
        });
    }
};

export { getLeaderboard };
