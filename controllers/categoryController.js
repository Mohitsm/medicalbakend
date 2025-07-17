import Category from '../models/Category.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { title, brand } = req.body;
  const image = req.file.path;

  const categoryExists = await Category.findOne({ title, brand });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists for this brand');
  }

  const category = await Category.create({
    title,
    image,
    brand,
  });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).populate('brand', 'title');
  res.json(categories);
});

// @desc    Get categories by brand ID
// @route   GET /api/categories/brand/:brandId
// @access  Public
const getCategoriesByBrand = asyncHandler(async (req, res) => {
  const categories = await Category.find({ brand: req.params.brandId }).populate(
    'brand',
    'title'
  );
  res.json(categories);
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    'brand',
    'title'
  );

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.title = req.body.title || category.title;
    category.image = req.file?.path || category.image;
    category.brand = req.body.brand || category.brand;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.deleteOne(); // ✅ Works in all recent Mongoose versions
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});


export {
  createCategory,
  getCategories,
  getCategoriesByBrand,
  getCategoryById,
  updateCategory,
  deleteCategory,
};