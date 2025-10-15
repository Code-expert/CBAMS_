import express from 'express';
import { 
  getAllListings,
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
  createMarketOrder,
  getMyOrders,
  updateOrderStatus
} from '../controllers/marketplaceController.js';
import { protect } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// PUBLIC ROUTES - Browse all listings
router.get('/listings', getAllListings);

// AUTHENTICATED ROUTES - Need login
router.post('/listings', protect, createListing);
router.get('/my-listings', protect, getMyListings);
router.put('/listings/:id', protect, updateListing);
router.delete('/listings/:id', protect, deleteListing);

// Order routes  
router.post('/orders', protect, createMarketOrder);
router.get('/my-orders', protect, getMyOrders);
router.patch('/orders/:id/status', protect, updateOrderStatus);

// Mandi price routes (mock data for now)
router.get('/mandi-prices', async (req, res) => {
  try {
    const { state, district, commodity } = req.query;
    const mockData = [
      { 
        commodity: 'Wheat', 
        state: 'Punjab', 
        district: 'Amritsar', 
        modalPrice: 2100, 
        minPrice: 2050, 
        maxPrice: 2150, 
        trend: 'up', 
        change: '+2.5', 
        market: 'Amritsar Mandi', 
        variety: 'HD 2967', 
        arrivalDate: new Date().toISOString().split('T')[0], 
        priceUnit: 'quintal' 
      },
      { 
        commodity: 'Rice', 
        state: 'Haryana', 
        district: 'Karnal', 
        modalPrice: 3200, 
        minPrice: 3100, 
        maxPrice: 3300, 
        trend: 'down', 
        change: '-1.2', 
        market: 'Karnal Mandi', 
        variety: 'Basmati', 
        arrivalDate: new Date().toISOString().split('T')[0], 
        priceUnit: 'quintal' 
      },
      { 
        commodity: 'Tomato', 
        state: 'Maharashtra', 
        district: 'Pune', 
        modalPrice: 25, 
        minPrice: 20, 
        maxPrice: 30, 
        trend: 'up', 
        change: '+5.8', 
        market: 'Pune Mandi', 
        variety: 'Hybrid', 
        arrivalDate: new Date().toISOString().split('T')[0], 
        priceUnit: 'kg' 
      }
    ];
    
    const filtered = mockData.filter(item => 
      (!state || item.state === state) &&
      (!district || item.district === district) &&
      (!commodity || item.commodity === commodity)
    );
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/nearby-mandis', async (req, res) => {
  try {
    res.json([
      { commodity: 'Wheat', modalPrice: 2100, market: 'Nearby Mandi', trend: 'up', change: '+2.5' }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
