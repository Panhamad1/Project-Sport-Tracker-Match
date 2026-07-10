import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { syncFixtures } from "../controllers/fixtureController.js";
import { syncTeams } from "../controllers/teamSyncController.js";
import { syncPlayers } from "../controllers/playerSyncController.js";
import { syncMatchDetails } from "../controllers/matchDetailSyncController.js";
import { syncStandings } from "../controllers/standingSyncController.js";

const router = express.Router();

router.post("/fixtures",protect,adminOnly,syncFixtures);
router.post("/teams",protect,adminOnly,syncTeams);
router.post("/players",protect,adminOnly,syncPlayers);
router.post("/standings",protect,adminOnly,syncStandings);
router.post("/matches/:matchId/details",protect,adminOnly,syncMatchDetails);
export default router;
