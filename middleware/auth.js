import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/adminModel.js';
import asyncHandler from 'express-async-handler';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (check both User and Admin models)
      let user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        // If not found in User model, check Admin model
        user = await Admin.findById(decoded.id).select('-password');
        if (user) {
          user.role = 'admin'; // Set role for admin
        }
      }

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin only middleware
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.email)) {
    // If user has email property, it's from Admin model
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
});

// Moderator and Admin middleware
export const moderatorOrAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator' || req.user.email)) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as moderator or admin');
  }
});

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
