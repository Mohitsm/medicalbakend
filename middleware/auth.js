// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import Admin from '../models/adminModel.js';
// import TokenBlacklist from '../models/TokenBlacklist.js';
// import UserActivity from '../models/UserActivity.js';
// import asyncHandler from 'express-async-handler';

// // Protect routes - verify JWT token
// export const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(' ')[1];

//       // Check if token is blacklisted
//       const blacklistedToken = await TokenBlacklist.findOne({ token });
//       if (blacklistedToken) {
//         res.status(401);
//         throw new Error('Token has been invalidated');
//       }

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from the token (check both User and Admin models)
//       let user = await User.findById(decoded.id).select('-password');

//       if (!user) {
//         // If not found in User model, check Admin model
//         user = await Admin.findById(decoded.id).select('-password');
//         if (user) {
//           user.role = 'admin'; // Set role for admin
//         }
//       }

//       if (!user) {
//         res.status(401);
//         throw new Error('Not authorized, user not found');
//       }

//       // Check if user account is active
//       if (user.status && user.status !== 'active') {
//         res.status(401);
//         throw new Error(`Account is ${user.status}`);
//       }

//       req.user = user;
//       req.token = token; // Store token for potential blacklisting
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       throw new Error('Not authorized, token failed');
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });

// // Admin only middleware
// export const adminOnly = asyncHandler(async (req, res, next) => {
//   if (req.user && (req.user.role === 'admin' || req.user.email)) {
//     // If user has email property, it's from Admin model
//     next();
//   } else {
//     res.status(403);
//     throw new Error('Not authorized as admin');
//   }
// });

// // Moderator and Admin middleware
// export const moderatorOrAdmin = asyncHandler(async (req, res, next) => {
//   if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator' || req.user.email)) {
//     next();
//   } else {
//     res.status(403);
//     throw new Error('Not authorized as moderator or admin');
//   }
// });

// // Generate JWT Token
// export const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// // Blacklist a token (for logout/security)
// export const blacklistToken = async (token, userId, userEmail, reason = 'logout', req = null) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const expiresAt = new Date(decoded.exp * 1000);

//     await TokenBlacklist.create({
//       token,
//       userId,
//       userEmail,
//       expiresAt,
//       reason,
//       ipAddress: req?.ip || req?.connection?.remoteAddress,
//       userAgent: req?.get('User-Agent')
//     });

//     return true;
//   } catch (error) {
//     console.error('Error blacklisting token:', error);
//     return false;
//   }
// };

// // Log user activity
// export const logUserActivity = async (userId, userEmail, action, req, success = true, details = null) => {
//   try {
//     await UserActivity.create({
//       userId,
//       userEmail,
//       action,
//       ipAddress: req?.ip || req?.connection?.remoteAddress,
//       userAgent: req?.get('User-Agent'),
//       success,
//       details
//     });
//   } catch (error) {
//     console.error('Error logging user activity:', error);
//   }
// };
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Admin from '../models/adminModel.js';
import TokenBlacklist from '../models/tokenBlacklist.js';
import UserActivity from '../models/UserActivity.js';
import asyncHandler from 'express-async-handler';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if token is blacklisted
      const blacklistedToken = await TokenBlacklist.findOne({ token });
      if (blacklistedToken) {
        res.status(401);
        throw new Error('Token has been invalidated');
      }

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

      // Check if user account is active
      if (user.status && user.status !== 'active') {
        res.status(401);
        throw new Error(`Account is ${user.status}`);
      }

      req.user = user;
      req.token = token; // Store token for potential blacklisting
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
  if (req.user && req.user.role === 'admin') {
    // Only allow users with admin role
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
});

// Moderator and Admin middleware
export const moderatorOrAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
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

// Blacklist a token (for logout/security)
export const blacklistToken = async (token, userId, userEmail, reason = 'logout', req = null) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000);

    await TokenBlacklist.create({
      token,
      userId,
      userEmail,
      expiresAt,
      reason,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('User-Agent')
    });

    return true;
  } catch (error) {
    console.error('Error blacklisting token:', error);
    return false;
  }
};

// Log user activity
export const logUserActivity = async (userId, userEmail, action, req, success = true, details = null) => {
  try {
    await UserActivity.create({
      userId,
      userEmail,
      action,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('User-Agent'),
      success,
      details
    });
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};