import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getDashboardData,
  getAdminOrders,
  getUserStats
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin authentication routes
router.post('/auth/register', registerAdmin);
router.post('/auth/login', loginAdmin);

// Admin dashboard routes (require authentication)
router.get('/dashboard', protect, adminOnly, getDashboardData);
router.get('/dashboard/user-stats', protect, adminOnly, getUserStats);
router.get('/orders', protect, adminOnly, getAdminOrders);

export default router;
