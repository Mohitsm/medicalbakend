import Subcategory from '../models/Subcategory.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new subcategory
// @route   POST /api/subcategories
// @access  Private/Admin
const createSubcategory = asyncHandler(async (req, res) => {
  const { title, category, brand } = req.body;
  const image = req.file.path;

  const subcategoryExists = await Subcategory.findOne({ title, category });
  if (subcategoryExists) {
    res.status(400);
    throw new Error('Subcategory already exists for this category');
  }

  const subcategory = await Subcategory.create({
    title,
    image,
    category,
    brand,
  });

  if (subcategory) {
    res.status(201).json(subcategory);
  } else {
    res.status(400);
    throw new Error('Invalid subcategory data');
  }
});

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
const getSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find({})
    .populate('category', 'title')
    .populate('brand', 'title');
  res.json(subcategories);
});

// @desc    Get subcategories by category ID
// @route   GET /api/subcategories/category/:categoryId
// @access  Public
const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find({
    category: req.params.categoryId,
  })
    .populate('category', 'title')
    .populate('brand', 'title');
  res.json(subcategories);
});

// @desc    Get subcategory by ID
// @route   GET /api/subcategories/:id
// @access  Public
const getSubcategoryById = asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id)
    .populate('category', 'title')
    .populate('brand', 'title');

  if (subcategory) {
    res.json(subcategory);
  } else {
    res.status(404);
    throw new Error('Subcategory not found');
  }
});

// @desc    Update subcategory
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
const updateSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);

  if (subcategory) {
    subcategory.title = req.body.title || subcategory.title;
    subcategory.image = req.file?.path || subcategory.image;
    subcategory.category = req.body.category || subcategory.category;
    subcategory.brand = req.body.brand || subcategory.brand;

    const updatedSubcategory = await subcategory.save();
    res.json(updatedSubcategory);
  } else {
    res.status(404);
    throw new Error('Subcategory not found');
  }
});

// @desc    Delete subcategory
// @route   DELETE /api/subcategories/:id
// @access  Private/Admin
const deleteSubcategory = async (req, res) => {
  try {
    const deleted = await Subcategory.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.status(200).json({ message: "SubCategory deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ export all at once
export {
  createSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};