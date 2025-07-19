import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }]
}, { timestamps: true });

export default mongoose.model('bsanner', bannerSchema);
