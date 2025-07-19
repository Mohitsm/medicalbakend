import Banner from '../models/Banner.js';
import fs from 'fs';
import path from 'path';

export const createBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    const images = req.files?.map(file => file.filename) || [];s

    console.log("CREATE BANNER BODY:", req.body);
    console.log("UPLOADED FILES:", req.files);

    if (!title || !description || images.length === 0) {
      return res.status(400).json({ message: 'Title, description, and images are required.' });
    }

    const newBanner = await Banner.create({ title, description, images });
    res.status(201).json(newBanner);
  } catch (err) {
    console.error("CREATE BANNER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    // Delete old images if new images are uploaded
    if (req.files && req.files.length > 0) {
      banner.images.forEach(image => {
        const imgPath = path.join('uploads', image);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });

      banner.images = req.files.map(file => file.filename);
    }

    if (title) banner.title = title;
    if (description) banner.description = description;

    await banner.save();
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    // Delete images from folder
    banner.images.forEach(image => {
      const imgPath = path.join('uploads', image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
