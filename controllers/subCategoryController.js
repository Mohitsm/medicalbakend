import SubCategory from "../models/SubCategory.js";

export const createSubCategory = async (req, res) => {
  const { title, brand, category } = req.body;
  const image = req.file?.filename;
  const subCategory = await SubCategory.create({ title, brand, category, image });
  res.json(subCategory);
};

export const getAllSubCategories = async (_, res) => {
  const subCats = await SubCategory.find().populate("brand").populate("category");
  res.json(subCats);
};

export const getSubCategoryById = async (req, res) => {
  const subCat = await SubCategory.findById(req.params.id).populate("brand").populate("category");
  subCat ? res.json(subCat) : res.status(404).json({ error: "Not found" });
};

export const updateSubCategory = async (req, res) => {
  const { title, brand, category } = req.body;
  const updateData = { title, brand, category };
  if (req.file) updateData.image = req.file.filename;
  const updated = await SubCategory.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updated);
};

export const deleteSubCategory = async (req, res) => {
  await SubCategory.findByIdAndDelete(req.params.id);
  res.json({ message: "SubCategory deleted" });
};
