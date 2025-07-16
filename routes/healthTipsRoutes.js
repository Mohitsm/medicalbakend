import express from "express";
import upload from "../middleware/upload.js";
import {
  createTip,
  getAllTips,
  getTipById,
  updateTip,
  deleteTip,
} from "../controllers/healthTipController.js";

const router = express.Router();

router.post("/", upload.single("image"), createTip);
router.get("/", getAllTips);
router.get("/:id", getTipById);
router.put("/:id", upload.single("image"), updateTip);
router.delete("/:id", deleteTip);

export default router;
