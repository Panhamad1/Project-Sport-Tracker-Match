import express from "express";
import { getPlayerById } from "../controllers/playerController.js";

const router = express.Router();

router.get("/:playerId", getPlayerById);

export default router;
