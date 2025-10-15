import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { expertOnly } from "../middlewares/expertMiddleware.js";
import { farmerOnly } from "../middlewares/farmerMiddleware.js";
import {
  bookSession,
  confirmSession,
  getFarmerSessions,
  getExpertSessions,
  updateSessionStatus  
} from "../controllers/sessionController.js";


const router = express.Router();

router.post("/", protect, farmerOnly, bookSession);                 // Farmer books
router.put("/:id/confirm", protect, expertOnly, confirmSession);    // Expert confirms
router.get("/farmer", protect, getFarmerSessions);      // Farmer gets all sessions
router.get("/expert", protect, getExpertSessions);      // Expert gets all sessions
router.put("/:id/status", protect, updateSessionStatus);

export default router;