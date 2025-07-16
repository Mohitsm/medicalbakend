import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const { title, counter, brand } = req.body;
  const image = req.file?.filename;
  const category = await Category.create({ title, counter, brand, image });
  res.json(category);
};

export const getAllCategories = async (_, res) => {
  const categories = await Category.find().populate("brand");
  res.json(categories);
};

export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id).populate("brand");
  category ? res.json(category) : res.status(404).json({ error: "Not found" });
};

export const getCategoriesByBrand = async (req, res) => {
  const categories = await Category.find({ brand: req.params.brandId });
  res.json(categories);
};

export const updateCategory = async (req, res) => {
  const { title, counter, brand } = req.body;
  const updateData = { title, counter, brand };
  if (req.file) updateData.image = req.file.filename;
  const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
