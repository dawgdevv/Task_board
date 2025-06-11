import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  getTimeLogs,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
  getTimeStats,
  getDailyTimeStats, // Add this import
} from "../controllers/timelog.controller.js";

const router = express.Router();

// Get all time logs with filtering and pagination
router.get("/", auth, getTimeLogs);

// Get time statistics
router.get("/stats", auth, getTimeStats);

// Get daily time statistics for a specific goal
router.get("/daily/:goalId", auth, getDailyTimeStats);

// Create new time log
router.post("/", auth, createTimeLog);

// Update time log
router.put("/:timeLogId", auth, updateTimeLog);

// Delete time log
router.delete("/:timeLogId", auth, deleteTimeLog);

export default router;
