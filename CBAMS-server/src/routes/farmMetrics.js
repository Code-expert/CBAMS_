import express from 'express';
import { getFarmMetrics, getHistoricalMetrics } from '../controllers/farmMetricsController.js';
import { protect } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/current', protect, getFarmMetrics);
router.get('/historical', protect, getHistoricalMetrics);

export default router;
