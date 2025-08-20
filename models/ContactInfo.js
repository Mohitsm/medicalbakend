import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  hours: { type: String, required: true },
}, { timestamps: true });

export const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);
