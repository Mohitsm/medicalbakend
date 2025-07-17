import Testimonial from "../models/Testimonial.js";

// Create
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    const saved = await testimonial.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ error: "Testimonial not found" });
    res.status(200).json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Testimonial not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Testimonial not found" });
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
