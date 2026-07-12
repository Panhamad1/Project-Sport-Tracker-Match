import express from "express";
import {
    deleteDreamTeam,
    getDreamTeamFormations,
    getMyDreamTeam,
    saveMyDreamTeam,
    updateDreamTeam,
} from "../controllers/dreamTeamController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/formations", getDreamTeamFormations);
router.get("/me", getMyDreamTeam);
router.post("/", saveMyDreamTeam);
router.patch("/:dreamTeamId", updateDreamTeam);
router.delete("/:dreamTeamId", deleteDreamTeam);

export default router;
