import Leadership from '../models/Leadership.js';
import fs from 'fs';
import path from 'path';

export const createLeadership = async (req, res) => {
  try {
    const { title, role, description } = req.body;
    const image = req.file?.filename;

    if (!title || !role || !description || !image) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const leader = new Leadership({ title, role, description, image });
    await leader.save();
    res.status(201).json(leader);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

export const getAllLeadership = async (req, res) => {
  try {
    const data = await Leadership.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

export const getLeadershipById = async (req, res) => {
  try {
    const leader = await Leadership.findById(req.params.id);
    if (!leader) return res.status(404).json({ message: 'Not found' });
    res.json(leader);
  } catch (err) {
    res.status(500).json({ message: 'Get failed', error: err.message });
  }
};

export const updateLeadership = async (req, res) => {
  try {
    const { title, role, description } = req.body;
    const leader = await Leadership.findById(req.params.id);
    if (!leader) return res.status(404).json({ message: 'Not found' });

    if (req.file) {
      const oldPath = path.resolve('uploads/leadership', leader.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      leader.image = req.file.filename;
    }

    leader.title = title || leader.title;
    leader.role = role || leader.role;
    leader.description = description || leader.description;

    await leader.save();
    res.json(leader);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

export const deleteLeadership = async (req, res) => {
  try {
    const leader = await Leadership.findById(req.params.id);
    if (!leader) return res.status(404).json({ message: 'Not found' });

    const imagePath = path.resolve('uploads/leadership', leader.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await Leadership.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
