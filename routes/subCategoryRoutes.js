import express from 'express';
import {
  createSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} from '../controllers/subCategoryController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .post(upload.single('image'), createSubcategory)
  .get(getSubcategories);

router.route('/category/:categoryId').get(getSubcategoriesByCategory);

router
  .route('/:id')
  .get(getSubcategoryById)
  .put(upload.single('image'), updateSubcategory)
  .delete(deleteSubcategory);

export default router;
