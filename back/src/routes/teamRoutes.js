import express from "express";
import { getTeamById } from "../controllers/teamController.js";

const router = express.Router();

router.get("/:teamId", getTeamById);

export default router;
