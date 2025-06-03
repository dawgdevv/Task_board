import express from "express";
import Task from "../models/task.model.js";
import TaskList from "../models/tasklist.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all task lists for user
router.get("/lists", auth, async (req, res) => {
  try {
    const taskLists = await TaskList.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(taskLists);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new task list
router.post("/lists", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const taskList = new TaskList({
      name,
      user: req.user._id,
    });

    await taskList.save();
    res.status(201).json(taskList);
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
    });
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
