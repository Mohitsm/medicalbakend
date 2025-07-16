import Admin from '../models/adminModel.js';
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
