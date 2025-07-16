import express from "express";
import upload from "../middleware/upload.js";
import {
  createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand
} from "../controllers/BrandController.js";

const router = express.Router();

router.post("/", upload.single("image"), createBrand);
router.get("/", getAllBrands);
router.get("/:id", getBrandById);
router.put("/:id", upload.single("image"), updateBrand);
router.delete("/:id", deleteBrand);

export default router;
