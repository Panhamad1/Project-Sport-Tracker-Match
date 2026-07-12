import {
    deleteDreamTeamService,
    getDreamTeamFormationsService,
    getMyDreamTeamService,
    saveMyDreamTeamService,
    updateDreamTeamService,
} from "../services/dreamTeamService.js";

const getPositiveIntegerParam = (value) => {
    const numberValue = Number(value);

    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const getDreamTeamFormations = (req, res) => {
    return res.status(200).json({
        message: "Dream team formations loaded successfully",
        formations: getDreamTeamFormationsService(),
    });
};

const getMyDreamTeam = async (req, res) => {
    try {
        const dreamTeam = await getMyDreamTeamService(req.user.id);

        return res.status(200).json({
            message: dreamTeam ? "Dream team loaded successfully" : "No dream team yet",
            dreamTeam,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load dream team",
            error: error.message,
        });
    }
};

const saveMyDreamTeam = async (req, res) => {
    try {
        const result = await saveMyDreamTeamService(req.user.id, req.body || {});

        if (result.status === "invalid") {
            return res.status(400).json({
                message: result.message,
            });
        }

        return res.status(result.created ? 201 : 200).json({
            message: result.created ? "Dream team created successfully" : "Dream team updated successfully",
            dreamTeam: result.dreamTeam,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to save dream team",
            error: error.message,
        });
    }
};

const updateDreamTeam = async (req, res) => {
    try {
        const dreamTeamId = getPositiveIntegerParam(req.params.dreamTeamId);

        if (!dreamTeamId) {
            return res.status(400).json({
                message: "Invalid dream team id",
            });
        }

        const result = await updateDreamTeamService(req.user.id, dreamTeamId, req.body || {});

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        if (result.status === "invalid") {
            return res.status(400).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: "Dream team updated successfully",
            dreamTeam: result.dreamTeam,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update dream team",
            error: error.message,
        });
    }
};

const deleteDreamTeam = async (req, res) => {
    try {
        const dreamTeamId = getPositiveIntegerParam(req.params.dreamTeamId);

        if (!dreamTeamId) {
            return res.status(400).json({
                message: "Invalid dream team id",
            });
        }

        const result = await deleteDreamTeamService(req.user.id, dreamTeamId);

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
            message: "Failed to delete dream team",
            error: error.message,
        });
    }
};

export {
    deleteDreamTeam,
    getDreamTeamFormations,
    getMyDreamTeam,
    saveMyDreamTeam,
    updateDreamTeam,
};
