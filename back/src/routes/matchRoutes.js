import express from "express";
import { getMatchById } from "../controllers/matchController.js";

const router = express.Router();

router.get("/:matchId", getMatchById);

export default router;
