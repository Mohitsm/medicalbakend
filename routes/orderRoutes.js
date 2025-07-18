// import express from 'express';
// import {
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   updateOrderStatus,
//   getUserOrders,
//   getOrderStats
// } from '../controllers/orderController.js';

// const router = express.Router();

// // Public routes
// router.post('/', createOrder);

// // Admin routes (you can add authentication middleware later)
// router.get('/', getAllOrders);
// router.get('/stats', getOrderStats);
// router.get('/:id', getOrderById);
// router.put('/:id/status', updateOrderStatus);

// // User routes
// router.get('/user/:userId', getUserOrders);

// export default router;
import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
  getOrderStats
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);

// Admin-only routes (require authentication and admin role)
router.get('/', protect, adminOnly, getAllOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// Protected routes (require authentication)
router.get('/:id', protect, getOrderById);
router.get('/user/:userId', protect, getUserOrders);

// Debug endpoint to check user authentication
router.get('/debug/whoami', protect, (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status
    },
    isAdmin: req.user.role === 'admin',
    canAccessAdminRoutes: req.user.role === 'admin'
  });
});

export default router;