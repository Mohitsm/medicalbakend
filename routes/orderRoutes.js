import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
  getOrderStats
} from '../controllers/orderController.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);

// Admin routes (you can add authentication middleware later)
router.get('/', getAllOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

// User routes
router.get('/user/:userId', getUserOrders);

export default router;
