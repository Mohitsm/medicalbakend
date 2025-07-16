import mongoose from 'mongoose';

const healthTipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, required: true },
  contentSections: {
    type: [String],
    validate: [arrayLimit, 'Exactly 10 content sections required'],
    required: true
  }
});

function arrayLimit(val) {
  return val.length === 10;
}

export default mongoose.model('HealthTip', healthTipSchema);
