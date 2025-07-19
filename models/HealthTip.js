import mongoose from "mongoose";

const HealthTipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, required: true },
  contentSections: { type: [String], required: true },
}, {
  timestamps: true,
});

export default mongoose.model("healthTip", HealthTipSchema);
