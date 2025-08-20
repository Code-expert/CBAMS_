import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { 
  bookSession, 
  confirmSession, 
  getFarmerSessions, 
  getExpertSessions 
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protect, bookSession);                 // Farmer books
router.put("/:id/confirm", protect, confirmSession);    // Expert confirms
router.get("/farmer", protect, getFarmerSessions);      // Farmer gets all sessions
router.get("/expert", protect, getExpertSessions);      // Expert gets all sessions

export default router;
