import express from "express";
import { getMatchById } from "../controllers/matchController.js";
import { getPublicMatchStreams } from "../controllers/streamLinkController.js";

const router = express.Router();

router.get("/:matchId/streams", getPublicMatchStreams);
router.get("/:matchId", getMatchById);

export default router;
