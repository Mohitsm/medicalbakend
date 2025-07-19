import HealthTip from '../models/HealthTip.js'

export const createTip = async (req, res) => {
  try {
    const { title, summary, contentSections } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const tip = new HealthTip({
      title,
      summary,
      contentSections: JSON.parse(contentSections),
      image,
    });

    await tip.save();
    res.status(201).json(tip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTips = async (req, res) => {
  const tips = await HealthTip.find().sort({ createdAt: -1 });
  res.json(tips);
};

export const getTipById = async (req, res) => {
  const tip = await HealthTip.findById(req.params.id);
  if (!tip) return res.status(404).json({ message: "Tip not found" });
  res.json(tip);
};

export const updateTip = async (req, res) => {
  try {
    const { title, summary, contentSections } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedFields = {
      title,
      summary,
      contentSections: JSON.parse(contentSections),
    };
    if (image) updatedFields.image = image;

    const tip = await HealthTip.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTip = async (req, res) => {
  await HealthTip.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};
