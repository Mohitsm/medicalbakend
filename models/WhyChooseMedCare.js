import mongoose from "mongoose";

const whyChooseMedCareSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // store image path or base64
}, { timestamps: true });

export const WhyChooseMedCare = mongoose.model("WhyChooseMedCare", whyChooseMedCareSchema);
