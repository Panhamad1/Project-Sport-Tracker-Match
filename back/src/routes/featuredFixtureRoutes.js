import express from "express";
import { getTopMatch } from "../controllers/featuredFixtureController.js";

const router = express.Router();

router.get("/", getTopMatch);

export default router;
