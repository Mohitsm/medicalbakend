import PromoCode from "../models/PromoCode.js";

// CREATE
export const createPromoCode = async (req, res) => {
  try {
    const promo = new PromoCode(req.body);
    const saved = await promo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL
export const getAllPromoCodes = async (req, res) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
export const getPromoCodeById = async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promo code not found" });
    res.json(promo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updatePromoCode = async (req, res) => {
  try {
    const updated = await PromoCode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Promo code not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deletePromoCode = async (req, res) => {
  try {
    const deleted = await PromoCode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Promo code not found" });
    res.json({ message: "Promo code deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
