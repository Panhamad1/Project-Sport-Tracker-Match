import express from "express";
import {
    deletePrediction,
    deletePredictionPick,
    getMatchPredictionOptions,
    getMyPredictionForMatch,
    getMyPredictions,
    savePrediction,
} from "../controllers/predictionController.js";
import { optionalAuth, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/matches/:apiFixtureId/options", optionalAuth, getMatchPredictionOptions);

router.use(protect);

router.get("/me", getMyPredictions);
router.post("/matches/:apiFixtureId", savePrediction);
router.post("/matches/:apiFixtureId/picks", savePrediction);
router.get("/matches/:apiFixtureId/me", getMyPredictionForMatch);
router.delete("/matches/:apiFixtureId", deletePrediction);
router.delete("/picks/:predictionPickId", deletePredictionPick);

export default router;
