import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
