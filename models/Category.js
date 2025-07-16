import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  counter: { type: Number, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);