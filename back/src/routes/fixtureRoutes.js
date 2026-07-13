import express from "express";
import { getFixtureFeed, getFixturesByDate } from "../controllers/fixtureController.js";

const router = express.Router();

router.get("/feed", getFixtureFeed);
router.get("/date/:date", getFixturesByDate);

export default router;
