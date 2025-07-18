// controllers/certificationController.js
import Certification from '../models/Certification.js';

// Create
export const createCertification = async (req, res) => {
  try {
    const certification = new Certification(req.body);
    await certification.save();
    res.status(201).json(certification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All
export const getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by ID
export const getCertificationById = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ error: 'Not Found' });
    res.json(certification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
export const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!certification) return res.status(404).json({ error: 'Not Found' });
    res.json(certification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
export const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) return res.status(404).json({ error: 'Not Found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
