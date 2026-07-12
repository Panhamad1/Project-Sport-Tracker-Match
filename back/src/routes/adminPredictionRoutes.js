import express from "express";
import { awardPredictionPoints, syncFixtureOdds } from "../controllers/predictionController.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/sync-odds/:apiFixtureId", syncFixtureOdds);
router.post("/award/:apiFixtureId", awardPredictionPoints);

export default router;
