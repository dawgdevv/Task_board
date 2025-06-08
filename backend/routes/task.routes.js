import express from "express";
import Task from "../models/task.model.js";
import TaskList from "../models/tasklist.model.js";
import Goal from "../models/goal.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all task lists for user with goal information
router.get("/lists", auth, async (req, res) => {
  try {
    const taskLists = await TaskList.find({ user: req.user._id })
      .populate("goal", "title description targetDate priority category")
      .sort({ createdAt: -1 });
    res.json(taskLists);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new task list (requires goalId)
router.post("/lists", auth, async (req, res) => {
  try {
    const { name, goalId } = req.body;

    // Verify goal exists and belongs to user
    const goal = await Goal.findOne({
      _id: goalId,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const taskList = new TaskList({
      name,
      goal: goalId,
      user: req.user._id,
    });

    await taskList.save();

    // Populate goal information before sending response
    await taskList.populate(
      "goal",
      "title description targetDate priority category"
    );

    res.status(201).json(taskList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get task lists for a specific goal
router.get("/goal/:goalId/lists", auth, async (req, res) => {
  try {
    const { goalId } = req.params;

    // Verify goal belongs to user
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
    })
      .populate("goal", "title description targetDate priority category")
      .sort({ createdAt: -1 });

    res.json(taskLists);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get tasks for a specific list
router.get("/list/:listId", auth, async (req, res) => {
  try {
    const { listId } = req.params;

    // Verify list belongs to user
    const taskList = await TaskList.findOne({
      _id: listId,
      user: req.user._id,
    }).populate("goal", "title description targetDate priority category");

    if (!taskList) {
      return res.status(404).json({ message: "Task list not found" });
    }

    const tasks = await Task.find({ list: listId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, listId } = req.body;

    // Verify list belongs to user
    const taskList = await TaskList.findOne({
      _id: listId,
      user: req.user._id,
    });
    if (!taskList) {
      return res.status(404).json({ message: "Task list not found" });
    }

    const task = new Task({
      title,
      description: description || "",
      list: listId,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update task
router.put("/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, completed } = req.body;

    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title || task.title;
    task.description =
      description !== undefined ? description : task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete task list
router.delete("/lists/:listId", auth, async (req, res) => {
  try {
    const { listId } = req.params;

    // Verify list belongs to user
    const taskList = await TaskList.findOne({
      _id: listId,
      user: req.user._id,
    });

    if (!taskList) {
      return res.status(404).json({ message: "Task list not found" });
    }

    // Delete all tasks in the list first
    await Task.deleteMany({ list: listId, user: req.user._id });

    // Delete the task list
    await TaskList.findByIdAndDelete(listId);

    res.json({ message: "Task list and all its tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete task
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
