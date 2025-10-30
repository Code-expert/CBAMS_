import express from 'express';
import { 
  getCropRecommendation, 
  getRecommendationHistory 
} from '../controllers/cropRecommendationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Get crop recommendation for location
router.get('/recommend', getCropRecommendation);

// Get user's recommendation history
router.get('/history', getRecommendationHistory);

export default router;
