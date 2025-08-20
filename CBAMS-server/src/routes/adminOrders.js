import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import {
  updateOrderStatus,
  getAllOrders,
} from "../controllers/adminOrderController.js";

const router = express.Router();

router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.get("/", protect, adminOnly, getAllOrders);

export default router;
