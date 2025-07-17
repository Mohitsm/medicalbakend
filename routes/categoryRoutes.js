import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoriesByBrand,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .post(upload.single('image'), createCategory)
  .get(getCategories);

router.route('/brand/:brandId').get(getCategoriesByBrand);

router
  .route('/:id')
  .get(getCategoryById)
  .put(upload.single('image'), updateCategory)
  .delete(deleteCategory);

export default router;
