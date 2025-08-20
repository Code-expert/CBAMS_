import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { cancelOrder,getMyOrders } from "../controllers/orderController.js";

const router = express.Router();


router.get("/", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
