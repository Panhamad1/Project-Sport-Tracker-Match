import express from "express";
import { getFixturesByDate } from "../controllers/fixtureController.js";

const router = express.Router();

router.get("/date/:date", getFixturesByDate);

export default router;