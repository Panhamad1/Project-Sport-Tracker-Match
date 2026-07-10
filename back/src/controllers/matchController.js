import { getMatchByIdFromDatabaseOnly } from "../services/matchService.js";

const getMatchById = async (req, res) => {
    try {
        const matchId = Number(req.params.matchId);

        if (!Number.isInteger(matchId) || matchId <= 0) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await getMatchByIdFromDatabaseOnly(matchId);

        if (!result.match) {
            return res.status(404).json({
                message: "Match not found",
                source: result.source,
                match: null,
            });
        }

        return res.status(200).json({
            message: "Match loaded successfully",
            source: result.source,
            match: result.match,
            details: result.details,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to load match",
            error: err.message,
        });
    }
};

export { getMatchById };
