import express from 'express';
import {
  predictYield,
  forecastPrice,
  analyzeSoil,
  optimizeResources,
  getDashboardAnalytics
} from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js'; 
const router = express.Router();

router.post('/predict/yield', protect, predictYield);
router.post('/predict/price', protect, forecastPrice);
router.post('/analyze/soil', protect, analyzeSoil);
router.post('/optimize/resources', protect, optimizeResources);
router.get('/dashboard', protect, getDashboardAnalytics);

export default router;
