import express from 'express';
import { registerAdmin, loginAdmin, getDashboardData, getAdminOrders } from '../controllers/adminController.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyToken,
  logoutUser,
  changePassword
} from '../controllers/userAuthController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// User authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/verify', protect, verifyToken);
router.post('/logout', protect, logoutUser);
router.put('/change-password', protect, changePassword);

// Admin authentication routes (legacy - keeping for backward compatibility)
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

// Admin dashboard routes (legacy)
router.get('/dashboard', getDashboardData);
router.get('/orders', getAdminOrders);

export default router;
