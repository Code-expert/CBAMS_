import express from "express";
import { getAllUsers, updateUserRole } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.put("/update-role/:userId", protect, adminOnly, updateUserRole);

export default router;
