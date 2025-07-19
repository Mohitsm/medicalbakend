
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// Helper function to safely parse JSON strings
const parseIfString = (value) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

// Helper function to create full image URLs


// @desc    Create a new product
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, sku, price, originalPrice, rating, reviews,
    category, subcategory, brand, badge, inStock,
    stockCount, description, features, specifications
  } = req.body;

  const images = req.files?.map((file) => file.filename) || [];

  const product = await Product.create({
    name,
    sku,
    price,
    originalPrice: originalPrice || price,
    rating: rating || 0,
    reviews: reviews || 0,
    category,
    subcategory,
    brand,
    badge,
    inStock: inStock ?? true,
    stockCount: stockCount || 0,
    description,
    features: parseIfString(features),
    specifications: parseIfString(specifications),
    images,
  });

  res.status(201).json(product);
});


// @desc    Get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('category', 'title')
    .populate('subcategory', 'title')
    .populate('brand', 'title');

  res.json(products);
});

// @desc    Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'title')
    .populate('subcategory', 'title')
    .populate('brand', 'title');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Update product
// @desc    Update product
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name, sku, price, originalPrice, rating, reviews,
    category, subcategory, brand, badge, inStock,
    stockCount, description, features, specifications
  } = req.body;

  product.name = name || product.name;
  product.sku = sku || product.sku;
  product.price = price || product.price;
  product.originalPrice = originalPrice || product.originalPrice;
  product.rating = rating || product.rating;
  product.reviews = reviews || product.reviews;
  product.category = category || product.category;
  product.subcategory = subcategory || product.subcategory;
  product.brand = brand || product.brand;
  product.badge = badge || product.badge;
  product.inStock = inStock ?? product.inStock;
  product.stockCount = stockCount || product.stockCount;
  product.description = description || product.description;
  product.features = features ? parseIfString(features) : product.features;
  product.specifications = specifications ? parseIfString(specifications) : product.specifications;

  // ✅ Fix: Map file names directly (no need for generateImageUrls)
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => file.filename);
    product.images = [...product.images, ...newImages];
  }

  const updated = await product.save();
  res.json(updated);
});


// @desc    Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @desc    Get products by brand ID
const getProductsByBrand = asyncHandler(async (req, res) => {
  const products = await Product.find({ brand: req.params.brandId })
    .populate('category', 'title')
    .populate('subcategory', 'title')
    .populate('brand', 'title');

  res.json(products);
});

// @desc    Get products by category ID
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.categoryId })
    .populate('category', 'title')
    .populate('subcategory', 'title')
    .populate('brand', 'title');

  res.json(products);
});

// @desc    Get products by subcategory ID
const getProductsBySubcategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ subcategory: req.params.subcategoryId })
    .populate('category', 'title')
    .populate('subcategory', 'title')
    .populate('brand', 'title');

  res.json(products);
});

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByBrand,
  getProductsByCategory,
  getProductsBySubcategory,
};
