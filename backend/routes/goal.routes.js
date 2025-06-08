import express from "express";
import Goal from "../models/goal.model.js";
import TaskList from "../models/tasklist.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all goals for user
router.get("/", auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new goal
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, targetDate, priority, category } = req.body;

    const goal = new Goal({
      title,
      description,
      targetDate,
      priority,
      category,
      user: req.user._id,
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single goal with task lists
router.get("/:goalId", auth, async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findOne({
      _id: goalId,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const taskLists = await TaskList.find({
      goal: goalId,
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ goal, taskLists });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update goal
router.put("/:goalId", auth, async (req, res) => {
  try {
    const { goalId } = req.params;
    const { title, description, targetDate, priority, category, completed } =
      req.body;

    const goal = await Goal.findOne({ _id: goalId, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.title = title || goal.title;
    goal.description =
      description !== undefined ? description : goal.description;
    goal.targetDate = targetDate || goal.targetDate;
    goal.priority = priority || goal.priority;
    goal.category = category !== undefined ? category : goal.category;
    goal.completed = completed !== undefined ? completed : goal.completed;

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete goal
router.delete("/:goalId", auth, async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findOne({ _id: goalId, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Delete associated task lists and tasks
    await TaskList.deleteMany({ goal: goalId, user: req.user._id });
    await Goal.findByIdAndDelete(goalId);

    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
