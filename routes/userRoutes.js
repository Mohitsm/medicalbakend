import express from 'express';
import {
  getAllUsers,
  getUserStats,
  getRecentUsers,
  updateUserStatus,
  deleteUser,
  getUserById,
  updateUserRole,
  updateUser
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// User management routes for admin panel (all require admin authentication)

// Get all users with pagination and filtering
// GET /api/users?page=1&limit=10&search=&status=&role=
router.get('/', protect, adminOnly, getAllUsers);

// Get recent users
// GET /api/users/recent?limit=5
router.get('/recent', protect, adminOnly, getRecentUsers);

// Get user statistics for admin dashboard
// GET /api/users/stats
router.get('/stats', protect, adminOnly, getUserStats);

// Get user by ID
// GET /api/users/:userId
router.get('/:userId', protect, adminOnly, getUserById);

// Update user status
// PUT /api/users/:userId/status
router.put('/:userId/status', protect, adminOnly, updateUserStatus);

// Update user role
// PUT /api/users/:userId/role
router.put('/:userId/role', protect, adminOnly, updateUserRole);

// Update user details
// PUT /api/users/:userId
router.put('/:userId', protect, adminOnly, updateUser);

// Delete user
// DELETE /api/users/:userId
router.delete('/:userId', protect, adminOnly, deleteUser);

export default router;
