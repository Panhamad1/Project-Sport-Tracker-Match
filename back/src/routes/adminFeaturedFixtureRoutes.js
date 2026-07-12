import express from "express";
import {
    addFeaturedFixture,
    deleteFeaturedFixture,
    getAdminTopMatch,
    updateFeaturedFixture,
} from "../controllers/featuredFixtureController.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getAdminTopMatch);
router.post("/:apiFixtureId", addFeaturedFixture);
router.patch("/:featuredFixtureId", updateFeaturedFixture);
router.delete("/:featuredFixtureId", deleteFeaturedFixture);

export default router;
