import mongoose from 'mongoose';

const leadershipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

const Leadership = mongoose.model('Leadership', leadershipSchema);
export default Leadership;
