import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all users with pagination and filtering
// @route   GET /api/users?page=1&limit=10&search=&status=&role=
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const status = req.query.status;
  const role = req.query.role;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  // Build filter object
  const filter = {};
  
  if (status) {
    filter.status = status;
  }
  
  if (role) {
    filter.role = role;
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  // Create sort object
  const sortObj = {};
  sortObj[sort] = order;

  const users = await User.find(filter)
    .select('-password') // Exclude password from results
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    success: true,
    users: users,
    total: totalUsers,
    page: page,
    limit: limit,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  });
});

// @desc    Get user statistics
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
    totalUsers,
    activeUsers,
    pendingUsers,
    suspendedUsers,
    inactiveUsers,
    newUsersThisMonth: recentUsers,
    adminUsers,
    moderatorUsers,
    regularUsers,
    monthlyUsers
  });
});

// @desc    Get recent users
// @route   GET /api/users?limit=5&sort=createdAt&order=desc
// @access  Private/Admin
export const getRecentUsers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users
  });
});

// @desc    Update user status
// @route   PUT /api/users/:userId/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { userId } = req.params;

  // Validate status
  const validStatuses = ['active', 'pending', 'suspended', 'inactive'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be one of: active, pending, suspended, inactive');
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User status updated to ${status}`,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent deletion of admin users
  if (user.role === 'admin') {
    res.status(403);
    throw new Error('Cannot delete admin users');
  }

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:userId
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user role
// @route   PUT /api/users/:userId/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { userId } = req.params;

  // Validate role
  const validRoles = ['user', 'admin', 'moderator'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid role. Must be one of: user, admin, moderator');
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Update user details
// @route   PUT /api/users/:userId
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone, address, role, status } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if email is being changed and if it already exists
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already exists');
    }
  }

  // Update fields if provided
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (role && ['user', 'admin', 'moderator'].includes(role)) user.role = role;
  if (status && ['active', 'pending', 'suspended', 'inactive'].includes(status)) user.status = status;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

// @desc    Create sample users for testing
// @route   POST /api/users/create-samples
// @access  Public (temporary for testing)
export const createSampleUsers = asyncHandler(async (req, res) => {
  // Check if sample users already exist
  const existingUsers = await User.countDocuments();

  if (existingUsers > 0) {
    return res.status(200).json({
      success: true,
      message: `${existingUsers} users already exist in database`,
      data: await User.find().select('-password').limit(5)
    });
  }

  // Create sample users
  const sampleUsers = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
      address: '123 Main St, City, State',
      role: 'user',
      status: 'active'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '0987654321',
      address: '456 Oak Ave, City, State',
      role: 'user',
      status: 'active'
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: 'password123',
      phone: '5555555555',
      address: '789 Pine St, City, State',
      role: 'moderator',
      status: 'active'
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      password: 'password123',
      phone: '1111111111',
      address: '321 Elm St, City, State',
      role: 'user',
      status: 'pending'
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      phone: '9999999999',
      address: '999 Admin Blvd, City, State',
      role: 'admin',
      status: 'active'
    }
  ];

  try {
    const createdUsers = await User.create(sampleUsers);

    res.status(201).json({
      success: true,
      message: `Created ${createdUsers.length} sample users`,
      data: createdUsers.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    res.status(400);
    throw new Error(`Error creating sample users: ${error.message}`);
  }
});

// @desc    Get database status and user count
// @route   GET /api/users/db-status
// @access  Public (temporary for testing)
export const getDatabaseStatus = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const users = await User.find().select('-password').limit(10);

    res.status(200).json({
      success: true,
      database: 'connected',
      totalUsers,
      sampleUsers: users,
      message: totalUsers === 0 ? 'No users found. Use POST /api/users/create-samples to create test users.' : `Found ${totalUsers} users in database`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: 'error',
      error: error.message
    });
  }
});
