import { WhyChooseMedCare } from "../models/WhyChooseMedCare.js";


import fs from "fs";

// CREATE
export const createEntry = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = `/uploads/${req.file.filename}`;
    const newEntry = new WhyChooseMedCare({ title, description, image });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getAllEntries = async (req, res) => {
  try {
    const entries = await WhyChooseMedCare.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
export const getEntryById = async (req, res) => {
  try {
    const entry = await WhyChooseMedCare.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateEntry = async (req, res) => {
  try {
    const entry = await WhyChooseMedCare.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Not found" });

    if (req.file) {
      if (entry.image && fs.existsSync("." + entry.image)) {
        fs.unlinkSync("." + entry.image);
      }
      entry.image = `/uploads/${req.file.filename}`;
    }

    entry.title = req.body.title;
    entry.description = req.body.description;
    await entry.save();

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteEntry = async (req, res) => {
  try {
    const entry = await WhyChooseMedCare.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Not found" });

    if (entry.image && fs.existsSync("." + entry.image)) {
      fs.unlinkSync("." + entry.image);
    }

    await WhyChooseMedCare.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
