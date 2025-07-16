import Brand from "../models/Brand.js";

export const createBrand = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file?.filename;
    const brand = await Brand.create({ title, image });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllBrands = async (_, res) => {
  const brands = await Brand.find();
  res.json(brands);
};

export const getBrandById = async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  brand ? res.json(brand) : res.status(404).json({ error: "Brand not found" });
};

export const updateBrand = async (req, res) => {
  try {
    const { title } = req.body;
    const updateData = { title };
    if (req.file) updateData.image = req.file.filename;
    const brand = await Brand.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBrand = async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({ message: "Brand deleted" });
};
