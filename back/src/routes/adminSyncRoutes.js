import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { getAdminFixturesByDate, syncFixture, syncFixtures } from "../controllers/fixtureController.js";
import { syncTeams } from "../controllers/teamSyncController.js";
import { syncPlayer, syncPlayers } from "../controllers/playerSyncController.js";
import { syncMatchDetails, syncMatchDetailsForDate } from "../controllers/matchDetailSyncController.js";
import { syncStandings } from "../controllers/standingSyncController.js";

const router = express.Router();

router.post("/fixtures",protect,adminOnly,syncFixtures);
router.get("/fixtures/date/:date",protect,adminOnly,getAdminFixturesByDate);
router.post("/fixtures/:fixtureId",protect,adminOnly,syncFixture);
router.post("/teams",protect,adminOnly,syncTeams);
router.post("/players",protect,adminOnly,syncPlayers);
router.post("/players/:playerApiId",protect,adminOnly,syncPlayer);
router.post("/standings",protect,adminOnly,syncStandings);
router.post("/matches/details/date/:date",protect,adminOnly,syncMatchDetailsForDate);
router.post("/matches/:matchId/details",protect,adminOnly,syncMatchDetails);
export default router;
