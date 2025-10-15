import express from "express";
import { getExperts, addExpert, updateExpert, removeExpert } from "../controllers/expertController.js";
import { protect } from "../middlewares/authMiddleware.js";
// import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", protect, getExperts);
router.post("/", protect, addExpert);
router.put("/:id", protect, updateExpert);
router.delete("/:id", protect, removeExpert);

export default router;
