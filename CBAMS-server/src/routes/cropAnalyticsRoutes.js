import express from 'express';
import {
  getCropsAnalytics,
  getCropDetails,
  createCrop,
  uploadCropImage,
  getAnalysisStatus,
  deleteCrop
} from '../controllers/cropAnalyticsController.js';
import { upload } from '../config/cloudinary.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all crops with analytics
router.get('/analytics', getCropsAnalytics);

// Get single crop details
router.get('/:cropId', getCropDetails);

// Create new crop
router.post('/', createCrop);

// Upload image for crop
router.post('/:cropId/upload-image', upload.single('image'), uploadCropImage);

// Get analysis status
router.get('/image/:imageId/status', getAnalysisStatus);

// Delete crop
router.delete('/:cropId', deleteCrop);

export default router;
