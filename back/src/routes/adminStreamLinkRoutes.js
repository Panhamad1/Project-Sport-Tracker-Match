import express from "express";
import {
    addStreamLink,
    deleteStreamLink,
    getAdminMatchStreams,
    updateStreamLink,
} from "../controllers/streamLinkController.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/matches/:apiFixtureId", getAdminMatchStreams);
router.post("/matches/:apiFixtureId", addStreamLink);
router.patch("/:streamLinkId", updateStreamLink);
router.delete("/:streamLinkId", deleteStreamLink);

export default router;
