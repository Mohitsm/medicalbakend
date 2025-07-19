import Brand from '../models/brand.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const image = req.file.path;

  const brandExists = await Brand.findOne({ title });
  if (brandExists) {
    res.status(400);
    throw new Error('Brand already exists');
  }

  const brand = await Brand.create({
    title,
    image,
  });

  if (brand) {
    res.status(201).json(brand);
  } else {
    res.status(400);
    throw new Error('Invalid brand data');
  }
});

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});
  res.json(brands);
});

// @desc    Get brand by ID
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    res.json(brand);
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    brand.title = req.body.title || brand.title;
    brand.image = req.file?.path || brand.image;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: 'Brand removed' });
  } else {
    res.status(404);
    throw new Error('Brand not found');
  }
});


export { createBrand, getBrands, getBrandById, updateBrand, deleteBrand };