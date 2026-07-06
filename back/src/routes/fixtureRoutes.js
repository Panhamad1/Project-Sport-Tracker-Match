import express from "express";
import { getFixturesByDate, syncFixtures, } from "../controllers/fixtureController.js";

const router = express.Router();

router.get("/date/:date", getFixturesByDate);
router.post("/sync", syncFixtures);

export default router;