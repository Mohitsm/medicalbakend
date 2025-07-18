import AboutMedCare from "../models/aboutMedCare.js";
import fs from "fs";

// Create
export const createAboutMedCare = async (req, res) => {
  try {
    const { description } = req.body;
    const image = req.file?.filename;

    if (!image || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const entry = new AboutMedCare({ description, image });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All
export const getAllAboutMedCare = async (req, res) => {
  try {
    const entries = await AboutMedCare.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getAboutMedCareById = async (req, res) => {
  try {
    const entry = await AboutMedCare.findById(req.params.id);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateAboutMedCare = async (req, res) => {
  try {
    const { description } = req.body;
    const entry = await AboutMedCare.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Not found" });

    if (req.file) {
      const oldImage = `uploads/about-medcare/${entry.image}`;
      if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
      entry.image = req.file.filename;
    }

    entry.description = description;
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteAboutMedCare = async (req, res) => {
  try {
    const entry = await AboutMedCare.findByIdAndDelete(req.params.id);
    if (entry?.image) {
      const imagePath = `uploads/about-medcare/${entry.image}`;
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
