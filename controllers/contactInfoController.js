import {ContactInfo} from "../models/ContactInfo.js";

// Create or Replace (Singleton Design)
export const createOrUpdateContactInfo = async (req, res) => {
  try {
    const existing = await ContactInfo.findOne();
    let result;

    if (existing) {
      result = await ContactInfo.findByIdAndUpdate(existing._id, req.body, { new: true });
    } else {
      result = await ContactInfo.create(req.body);
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all (optional singleton support)
export const getAllContactInfo = async (req, res) => {
  try {
    const data = await ContactInfo.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getContactInfoById = async (req, res) => {
  try {
    const contact = await ContactInfo.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact info not found" });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update by ID
export const updateContactInfo = async (req, res) => {
  try {
    const updated = await ContactInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete by ID
export const deleteContactInfo = async (req, res) => {
  try {
    const deleted = await ContactInfo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Contact info deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
