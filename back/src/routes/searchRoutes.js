import express from "express";
import { searchTeamsAndPlayers } from "../controllers/searchController.js";

const router = express.Router();
router.get("/",searchTeamsAndPlayers);

export default router;