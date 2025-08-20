import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createSchedule, getSchedules, updateSchedule, deleteSchedule } from "../controllers/scheduleController.js";

const router = express.Router();

router.post("/", protect, createSchedule);
router.get("/", protect, getSchedules);
router.put("/:id", protect, updateSchedule);
router.delete("/:id", protect, deleteSchedule);

export default router;
