import SuperAdmin from '../models/superAdminModel.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// Register SuperAdmin
export const registerSuperAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const superAdminExists = await SuperAdmin.findOne({ email });
  if (superAdminExists) {
    res.status(400);
    throw new Error('SuperAdmin already exists');
  }

  const superAdmin = await SuperAdmin.create({ email, password });

  const token = jwt.sign(
    { id: superAdmin._id, email: superAdmin.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(201).json({
    success: true,
    data: {
      id: superAdmin._id,
      email: superAdmin.email,
      token
    }
  });
});

// Login SuperAdmin
export const loginSuperAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const superAdmin = await SuperAdmin.findOne({ email });
  if (!superAdmin) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await superAdmin.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: superAdmin._id, email: superAdmin.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    success: true,
    data: {
      id: superAdmin._id,
      email: superAdmin.email,
      token
    }
  });
});
