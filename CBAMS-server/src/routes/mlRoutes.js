import express from 'express';
import { 
  getYieldPrediction, 
  getPriceForecast,
  detectDisease
} from '../controllers/mlController.js';
import { upload } from '../config/cloudinary.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Predict crop yield
router.post('/yield', getYieldPrediction);

// Get price forecast
router.get('/price', getPriceForecast);

// Detect disease from image
router.post('/detect-disease', upload.single('image'), detectDisease);

export default router;
