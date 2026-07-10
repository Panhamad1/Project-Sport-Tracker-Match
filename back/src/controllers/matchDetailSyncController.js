import { syncMatchDetailsById } from "../services/matchDetailSyncService.js";

const syncMatchDetails = async (req, res) => {
    try {
        const matchId = Number(req.params.matchId);

        if (!Number.isInteger(matchId) || matchId <= 0) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await syncMatchDetailsById(matchId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: "Match details synced successfully",
            source: "api_football_admin_sync",
            fixture_id: result.fixture_id,
            api_fixture_id: result.api_fixture_id,
            sections: result.sections,
            errors: result.errors,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to sync match details",
            error: err.message,
        });
    }
};

export { syncMatchDetails };
