import {
    addPinnedMatchService,
    getMyPinnedMatchesService,
    removePinnedMatchService,
} from "../services/pinnedMatchService.js";

const getApiFixtureIdFromParams = (req) => {
    return Number(req.params.apiFixtureId);
};

const addPinnedMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        const apiFixtureId = getApiFixtureIdFromParams(req);

        if (!Number.isInteger(apiFixtureId) || apiFixtureId <= 0) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await addPinnedMatchService(userId, apiFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(result.created ? 201 : 200).json({
            message: result.created ? "Match pinned successfully" : "Match already pinned",
            pinnedMatch: result.pinnedMatch,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to pin match",
            error: error.message,
        });
    }
};

const getMyPinnedMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        const pinnedMatches = await getMyPinnedMatchesService(userId);

        return res.status(200).json({
            message: pinnedMatches.length === 0
                ? "No pinned matches yet"
                : "Pinned matches loaded successfully",
            count: pinnedMatches.length,
            pinnedMatches,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load pinned matches",
            error: error.message,
        });
    }
};

const removePinnedMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        const apiFixtureId = getApiFixtureIdFromParams(req);

        if (!Number.isInteger(apiFixtureId) || apiFixtureId <= 0) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await removePinnedMatchService(userId, apiFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: result.message,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to remove pinned match",
            error: error.message,
        });
    }
};

export {
    addPinnedMatch,
    getMyPinnedMatches,
    removePinnedMatch,
};
