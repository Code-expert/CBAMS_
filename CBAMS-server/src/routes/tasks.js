import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getTasks, getTaskStats, createTask, updateTask, updateTaskStatus, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.get("/stats", protect, getTaskStats);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.put("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);

export default router;
