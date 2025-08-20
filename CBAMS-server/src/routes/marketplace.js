import express from "express";
import {
    getAllShops,
    getFertilizersByShop,
    placeOrder,
    getMyOrders
} from "../controllers/marketplaceController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/shops", getAllShops);
router.get("/shops/:id/fertilizers", getFertilizersByShop);

// Authenticated user routes
router.post("/orders", protect, placeOrder);
router.get("/orders", protect, getMyOrders);

export default router;
