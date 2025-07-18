// models/Certification.js
import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Certification = mongoose.model('Certification', certificationSchema);

export default Certification;
