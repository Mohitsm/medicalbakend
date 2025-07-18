import express from 'express';
import upload from '../middleware/upload.js';
import {
  createLeadership,
  getAllLeadership,
  getLeadershipById,
  updateLeadership,
  deleteLeadership,
} from '../controllers/leadershipController.js';

const router = express.Router();

router.post('/', upload.single('image'), createLeadership);
router.get('/', getAllLeadership);
router.get('/:id', getLeadershipById);
router.put('/:id', upload.single('image'), updateLeadership);
router.delete('/:id', deleteLeadership);

export default router;
