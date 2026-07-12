import express from "express";
import {
    addPinnedMatch,
    getMyPinnedMatches,
    removePinnedMatch,
} from "../controllers/pinnedMatchController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/:apiFixtureId", addPinnedMatch);
router.get("/", getMyPinnedMatches);
router.delete("/:apiFixtureId", removePinnedMatch);

export default router;
