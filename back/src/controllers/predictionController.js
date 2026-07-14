import {
    awardPredictionPointsService,
    deletePredictionPickService,
    deletePredictionService,
    getMatchPredictionOptionsService,
    getMyPredictionForMatchService,
    getMyPredictionsService,
    savePredictionPickService,
    syncFixtureOddsService,
} from "../services/predictionService.js";

const getPositiveIntegerParam = (value) => {
    const numberValue = Number(value);

    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const syncFixtureOdds = async (req, res) => {
    try {
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await syncFixtureOddsService(apiFixtureId, {
            bookmaker: req.query.bookmaker,
        });

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to sync prediction odds",
            error: error.message,
        });
    }
};

const getMatchPredictionOptions = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await getMatchPredictionOptionsService(userId, apiFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load prediction options",
            error: error.message,
        });
    }
};

const savePrediction = async (req, res) => {
    try {
        const userId = req.user.id;
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);
        const fixtureOddId = getPositiveIntegerParam(req.body.fixture_odd_id || req.body.fixtureOddId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        if (!fixtureOddId) {
            return res.status(400).json({
                message: "fixture_odd_id is required",
            });
        }

        const result = await savePredictionPickService(userId, apiFixtureId, fixtureOddId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        if (result.status === "locked" || result.status === "awarded") {
            return res.status(409).json({
                message: result.message,
                match: result.match,
            });
        }

        return res.status(result.created ? 201 : 200).json({
            message: result.created ? "Prediction pick saved successfully" : "Prediction pick replaced successfully",
            predictionPick: result.predictionPick,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to save prediction pick",
            error: error.message,
        });
    }
};

const getMyPredictions = async (req, res) => {
    try {
        const userId = req.user.id;
        const predictions = await getMyPredictionsService(userId);

        return res.status(200).json({
            message: predictions.length === 0 ? "No predictions yet" : "Predictions loaded successfully",
            count: predictions.length,
            predictions,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load predictions",
            error: error.message,
        });
    }
};

const getMyPredictionForMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await getMyPredictionForMatchService(userId, apiFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
                my_picks: [],
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to load prediction",
            error: error.message,
        });
    }
};

const deletePredictionPick = async (req, res) => {
    try {
        const userId = req.user.id;
        const predictionPickId = getPositiveIntegerParam(req.params.predictionPickId);

        if (!predictionPickId) {
            return res.status(400).json({
                message: "Invalid prediction pick id",
            });
        }

        const result = await deletePredictionPickService(userId, predictionPickId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        if (result.status === "locked" || result.status === "awarded") {
            return res.status(409).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: result.message,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete prediction pick",
            error: error.message,
        });
    }
};

const deletePrediction = async (req, res) => {
    try {
        const userId = req.user.id;
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await deletePredictionService(userId, apiFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        if (result.status === "locked" || result.status === "awarded") {
            return res.status(409).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: result.message,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete prediction",
            error: error.message,
        });
    }
};

const awardPredictionPoints = async (req, res) => {
    try {
        const apiFixtureId = getPositiveIntegerParam(req.params.apiFixtureId);

        if (!apiFixtureId) {
            return res.status(400).json({
                message: "Invalid match id",
            });
        }

        const result = await awardPredictionPointsService(apiFixtureId);

        if (result.status === "not_found") {
            return res.status(404).json({
                message: result.message,
            });
        }

        if (result.status === "not_finished" || result.status === "missing_score") {
            return res.status(400).json({
                message: result.message,
                match: result.match,
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to award prediction points",
            error: error.message,
        });
    }
};

export {
    awardPredictionPoints,
    deletePrediction,
    deletePredictionPick,
    getMatchPredictionOptions,
    getMyPredictionForMatch,
    getMyPredictions,
    savePrediction,
    syncFixtureOdds,
};
