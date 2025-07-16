import express from "express";
import upload from "../middleware/upload.js";
import {
  createSubCategory, getAllSubCategories, getSubCategoryById,
  updateSubCategory, deleteSubCategory
} from "../controllers/subCategoryController.js";

const router = express.Router();

router.post("/", upload.single("image"), createSubCategory);
router.get("/", getAllSubCategories);
router.get("/:id", getSubCategoryById);
router.put("/:id", upload.single("image"), updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
