import express from "express";
import { getMyProfile, updateMyProfile } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateMyProfile);

export default router;
