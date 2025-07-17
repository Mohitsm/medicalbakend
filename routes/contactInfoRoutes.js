import express from "express";
import {
  createOrUpdateContactInfo,
  getAllContactInfo,
  getContactInfoById,
  updateContactInfo,
  deleteContactInfo,
} from "../controllers/contactInfoController.js";

const router = express.Router();

// Singleton-style create or update
router.post("/", createOrUpdateContactInfo);

// Get all or multiple (in case you store many versions)
router.get("/", getAllContactInfo);

// Get by ID
router.get("/:id", getContactInfoById);

// Update by ID
router.put("/:id", updateContactInfo);

// Delete by ID
router.delete("/:id", deleteContactInfo);

export default router;
