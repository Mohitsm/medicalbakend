import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByBrand,
  getProductsByCategory,
  getProductsBySubcategory,
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .post(upload.array('images', 10), createProduct)
  .get(getProducts);

router.route('/brand/:brandId').get(getProductsByBrand);
router.route('/category/:categoryId').get(getProductsByCategory);
router.route('/subcategory/:subcategoryId').get(getProductsBySubcategory);

router
  .route('/:id')
  .get(getProductById)
  .put(upload.array('images', 10), updateProduct)
  .delete(deleteProduct);

export default router;
