import Admin from '../models/adminModel.js';
import Order from '../models/Order.js'
import User from '../models/user.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// Register Admin
export const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  const admin = await Admin.create({ email, password });

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(201).json({
    success: true,
    data: {
      id: admin._id,
      email: admin.email,
      token
    }
  });
});

// Login Admin
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    success: true,
    data: {
      id: admin._id,
      email: admin.email,
      token
    }
  });
});

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardData = asyncHandler(async (req, res) => {
  // Get order statistics
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
  const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
  const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
  const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

  // Get user statistics
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });

  // Get product statistics
  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ isActive: true });
  const outOfStockProducts = await Product.countDocuments({ stock: 0 });

  // Calculate total revenue
  const revenueResult = await Order.aggregate([
    { $match: { 'paymentInfo.paymentStatus': 'Paid' } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  // Get recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get monthly revenue data for chart
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        'paymentInfo.paymentStatus': 'Paid',
        createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      statistics: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        users: {
          total: totalUsers,
          active: activeUsers
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          outOfStock: outOfStockProducts
        },
        revenue: {
          total: totalRevenue
        }
      },
      recentOrders,
      monthlyRevenue
    }
  });
});

// @desc    Get all orders for admin dashboard
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const status = req.query.status;
  const paymentStatus = req.query.paymentStatus;
  const search = req.query.search;

  // Build filter object
  const filter = {};

  if (status) {
    filter.orderStatus = status;
  }

  if (paymentStatus) {
    filter['paymentInfo.paymentStatus'] = paymentStatus;
  }

  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customerInfo.name': { $regex: search, $options: 'i' } },
      { 'customerInfo.email': { $regex: search, $options: 'i' } },
      { 'customerInfo.phone': { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / limit);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      currentPage: page,
      totalPages,
      totalOrders,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get user statistics for admin dashboard
// @route   GET /api/admin/dashboard/user-stats
// @access  Private/Admin
export const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: 'active' });
  const pendingUsers = await User.countDocuments({ status: 'pending' });
  const suspendedUsers = await User.countDocuments({ status: 'suspended' });
  const inactiveUsers = await User.countDocuments({ status: 'inactive' });

  // Users by role
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const moderatorUsers = await User.countDocuments({ role: 'moderator' });
  const regularUsers = await User.countDocuments({ role: 'user' });

  // Recent users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Monthly user registration data for chart
  const monthlyUsers = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      pendingUsers,
      suspendedUsers,
      inactiveUsers,
      adminUsers,
      moderatorUsers,
      regularUsers,
      recentUsers,
      monthlyUsers
    }
  });
});
