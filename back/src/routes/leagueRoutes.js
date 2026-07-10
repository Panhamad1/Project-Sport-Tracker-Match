import express from "express";
import { getLeagueStandings } from "../controllers/leagueController.js";

const router = express.Router();

router.get("/:leagueId/standings", getLeagueStandings);

export default router;
