import express from "express";
import Task from "../models/task.model.js";
import TaskList from "../models/tasklist.model.js";
import Goal from "../models/goal.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all task lists for user with goal information - optimized
router.get("/lists", auth, async (req, res) => {
  try {
    const taskLists = await TaskList.find({ user: req.user._id })
      .populate("goal", "title description targetDate priority category")
      .select("name goal user createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(taskLists);
  } catch (error) {
    console.error("Error fetching task lists:", error);
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
    })
      .select("_id")
      .lean();

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const taskList = new TaskList({
      name: name.trim(),
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
    console.error("Error creating task list:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get task lists for a specific goal - optimized
router.get("/goal/:goalId/lists", auth, async (req, res) => {
  try {
    const { goalId } = req.params;

    // Parallel queries for better performance
    const [goal, taskLists] = await Promise.all([
      Goal.findOne({ _id: goalId, user: req.user._id }).select("_id").lean(),
      TaskList.find({ goal: goalId, user: req.user._id })
        .populate("goal", "title description targetDate priority category")
        .select("name goal user createdAt")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(taskLists);
  } catch (error) {
    console.error("Error fetching goal task lists:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get tasks for a specific list - optimized
router.get("/list/:listId", auth, async (req, res) => {
  try {
    const { listId } = req.params;

    // Verify list belongs to user and get tasks in parallel
    const [taskList, tasks] = await Promise.all([
      TaskList.findOne({ _id: listId, user: req.user._id })
        .populate("goal", "title description targetDate priority category")
        .lean(),
      Task.find({ list: listId, user: req.user._id })
        .select("title description completed list user createdAt")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    if (!taskList) {
      return res.status(404).json({ message: "Task list not found" });
    }

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new task with validation
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, listId } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Verify list belongs to user
    const taskList = await TaskList.findOne({
      _id: listId,
      user: req.user._id,
    })
      .select("_id")
      .lean();

    if (!taskList) {
      return res.status(404).json({ message: "Task list not found" });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || "",
      list: listId,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update task - optimized
router.put("/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    // Remove undefined values
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user._id },
      updates,
      { new: true, lean: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete task list with cascade delete
router.delete("/lists/:listId", auth, async (req, res) => {
  try {
    const { listId } = req.params;

    const taskList = await TaskList.findOne({
      _id: listId,
      user: req.user._id,
    }).lean();

    if (!taskList) {
      return res.status(404).json({ message: "Task list not found" });
    }

    // Use parallel operations for better performance
    await Promise.all([
      Task.deleteMany({ list: listId, user: req.user._id }),
      TaskList.findByIdAndDelete(listId),
    ]);

    res.json({ message: "Task list and all its tasks deleted successfully" });
  } catch (error) {
    console.error("Error deleting task list:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete task
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user._id,
    }).lean();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
