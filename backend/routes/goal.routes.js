import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  allgoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goal.controller.js";

const router = express.Router();

// Get all goals for user with optimized query
router.get("/", auth, allgoals);

// Get single goal with task lists - optimized
router.get("/:goalId", auth, getGoalById);

// Create new goal with validation
router.post("/", auth, createGoal);

// Update goal with optimized query
router.put("/:goalId", auth, updateGoal);

// Delete goal with cascade delete
router.delete("/:goalId", auth, deleteGoal);

export default router;
