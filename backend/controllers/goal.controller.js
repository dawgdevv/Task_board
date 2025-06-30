import Goal from "../models/goal.model.js";
import TaskList from "../models/tasklist.model.js";
import Task from "../models/task.model.js";
import mongoose from "mongoose";

export const allgoals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10
    const skip = (page - 1) * limit;

    const [goals, totalGoals] = await Promise.all([
      Goal.find({ user: req.user._id })
        .select(
          "title description targetDate priority category completed createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Goal.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      goals,
      currentPage: page,
      totalPages: Math.ceil(totalGoals / limit),
      totalGoals,
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getGoalById = async (req, res) => {
  try {
    const { goalId } = req.params;

    // Use Promise.all for parallel queries
    const [goal, taskLists] = await Promise.all([
      Goal.findOne({ _id: goalId, user: req.user._id }).lean(),
      TaskList.find({ goal: goalId, user: req.user._id })
        .select("name goal user createdAt")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({ goal, taskLists });
  } catch (error) {
    console.error("Error fetching goal details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const { title, description, targetDate, priority, category } = req.body;

    // Validate required fields
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!targetDate) {
      return res.status(400).json({ message: "Target date is required" });
    }

    const goal = new Goal({
      title: title.trim(),
      description: description?.trim() || "",
      targetDate,
      priority: priority || "medium",
      category: category?.trim() || "",
      user: req.user._id,
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const updates = req.body;

    // Remove undefined values
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, user: req.user._id },
      updates,
      { new: true, lean: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findOne({ _id: goalId, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Use session for transaction
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Delete all tasks first
        const taskLists = await TaskList.find({
          goal: goalId,
          user: req.user._id,
        }).session(session);
        const taskListIds = taskLists.map((list) => list._id);

        if (taskListIds.length > 0) {
          await Task.deleteMany({
            list: { $in: taskListIds },
            user: req.user._id,
          }).session(session);
        }

        // Delete task lists
        await TaskList.deleteMany({ goal: goalId, user: req.user._id }).session(
          session
        );

        // Delete goal
        await Goal.findByIdAndDelete(goalId).session(session);
      });

      res.json({ message: "Goal and all related data deleted successfully" });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
