import express from 'express';
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from '../controllers/BrandController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .post(upload.single('image'), createBrand)
  .get(getBrands);

router
  .route('/:id')
  .get(getBrandById)
  .put(upload.single('image'), updateBrand)
  .delete(deleteBrand);

export default router;
