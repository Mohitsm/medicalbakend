import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
}, { timestamps: true });

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);

