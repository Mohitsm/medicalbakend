import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("SubCategory", subCategorySchema);