// routes/whyChooseMedCareRoutes.js

import express from "express";
import upload from "../middleware/upload.js";
import {
  createEntry,
  getAllEntries,
  getEntryById,         // ✅ Add this
  updateEntry,
  deleteEntry,
} from "../controllers/whyChooseMedCareController.js";

const router = express.Router();

router.post("/", upload.single("image"), createEntry);
router.get("/", getAllEntries);
router.get("/:id", getEntryById);         // ✅ Add this line
router.put("/:id", upload.single("image"), updateEntry);
router.delete("/:id", deleteEntry);

export default router;
