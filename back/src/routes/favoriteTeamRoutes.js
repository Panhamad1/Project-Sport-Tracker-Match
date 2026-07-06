import express from "express";
import { addFavoriteTeam,getMyFavoriteTeams,RemoveFavoriteTeam } from "../controllers/favoriteTeamController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.post("/:teamId",addFavoriteTeam);
router.get("/",getMyFavoriteTeams);
router.delete("/:teamId",RemoveFavoriteTeam);

export default router;