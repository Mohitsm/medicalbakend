import express from 'express';
import upload from '../middleware/upload.js';
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';

const router = express.Router();

router.post('/', upload.array('images', 10), createBanner);
router.get('/', getAllBanners);
router.get('/:id', getBannerById);
router.put('/:id', upload.array('images', 10), updateBanner);
router.delete('/:id', deleteBanner);

export default router;
