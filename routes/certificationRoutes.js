// routes/certificationRoutes.js
import express from 'express';
import {
  createCertification,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
} from '../controllers/certificationController.js';

const router = express.Router();

router.post('/', createCertification);
router.get('/', getAllCertifications);
router.get('/:id', getCertificationById);
router.put('/:id', updateCertification);
router.delete('/:id', deleteCertification);

export default router;
