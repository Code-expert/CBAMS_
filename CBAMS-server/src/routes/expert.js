import express from "express";
import { getExperts, addExpert, updateExpert, removeExpert } from "../controllers/expertController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getExperts);
router.post("/", protect, adminOnly, addExpert);
router.put("/:id", protect, adminOnly, updateExpert);
router.delete("/:id", protect, adminOnly, removeExpert);

export default router;
