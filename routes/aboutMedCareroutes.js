import express from "express";
import upload from "../middleware/upload.js";
import {
  createAboutMedCare,
  getAllAboutMedCare,
  getAboutMedCareById,
  updateAboutMedCare,
  deleteAboutMedCare,
} from "../controllers/aboutMedCarecontroller.js";

const router = express.Router();

router.post("/", upload.single("image"), createAboutMedCare);
router.get("/", getAllAboutMedCare);
router.get("/:id", getAboutMedCareById);
router.put("/:id", upload.single("image"), updateAboutMedCare);
router.delete("/:id", deleteAboutMedCare);

export default router;
