import express from "express";
import upload from "../middleware/upload.js";
import {
  createMission,
  getAllMissions,
  getMissionById,
  updateMission,
  deleteMission,
} from "../controllers/ourMissionController.js";

const router = express.Router();

router.post("/", upload.single("image"), createMission);
router.get("/", getAllMissions);
router.get("/:id", getMissionById);
router.put("/:id", upload.single("image"), updateMission);
router.delete("/:id", deleteMission);

export default router;
