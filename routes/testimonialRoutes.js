import express from "express";
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.post("/", createTestimonial);            // Create
router.get("/", getAllTestimonials);            // Get all
router.get("/:id", getTestimonialById);         // Get by ID
router.put("/:id", updateTestimonial);          // Update
router.delete("/:id", deleteTestimonial);       // Delete

export default router;
