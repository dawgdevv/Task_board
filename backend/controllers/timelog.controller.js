import TimeLog from "../models/timelog.model.js";
import Goal from "../models/goal.model.js";
import TaskList from "../models/tasklist.model.js";
import Task from "../models/task.model.js";
import mongoose from "mongoose";

// Get all time logs for user with pagination
export const getTimeLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      goalId,
      taskListId,
      taskId,
      startDate,
      endDate,
    } = req.query;

    const filter = { user: req.user._id };

    // Add optional filters
    if (goalId) filter.goal = goalId;
    if (taskListId) filter.taskList = taskListId;
    if (taskId) filter.task = taskId;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const timeLogs = await TimeLog.find(filter)
      .populate("goal", "title category priority")
      .populate("taskList", "name")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await TimeLog.countDocuments(filter);

    res.json({
      timeLogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching time logs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new time log
export const createTimeLog = async (req, res) => {
  try {
    const {
      goalId,
      taskListId,
      taskId,
      duration,
      startTime,
      endTime,
      description,
      category,
      isTimerSession = false,
    } = req.body;

    // Validate required fields
    if (!goalId) {
      return res.status(400).json({ message: "Goal ID is required" });
    }

    // Verify goal exists and belongs to user
    const goal = await Goal.findOne({
      _id: goalId,
      user: req.user._id,
    }).lean();

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Verify optional taskList belongs to user and goal
    if (taskListId) {
      const taskList = await TaskList.findOne({
        _id: taskListId,
        user: req.user._id,
        goal: goalId,
      }).lean();

      if (!taskList) {
        return res.status(404).json({ message: "Task list not found" });
      }
    }

    // Verify optional task belongs to user and taskList
    if (taskId) {
      const task = await Task.findOne({
        _id: taskId,
        user: req.user._id,
        ...(taskListId && { list: taskListId }),
      }).lean();

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
    }

    // Prepare time log data
    const timeLogData = {
      goal: goalId,
      user: req.user._id,
      description: description?.trim() || "",
      category: category || "execution",
      isTimerSession,
    };

    // Add optional fields
    if (taskListId) timeLogData.taskList = taskListId;
    if (taskId) timeLogData.task = taskId;

    // Handle duration and time calculation
    let calculatedDuration;
    let logStartTime;
    let logEndTime;

    // Priority 1: Use provided duration if valid
    if (duration && duration > 0) {
      calculatedDuration = parseInt(duration);

      // Set times based on what's provided
      if (startTime && endTime) {
        logStartTime = new Date(startTime);
        logEndTime = new Date(endTime);

        // Validate that end time is after start time
        if (logEndTime <= logStartTime) {
          return res.status(400).json({
            message: "End time must be after start time",
          });
        }
      } else if (startTime) {
        // Calculate end time from start time + duration
        logStartTime = new Date(startTime);
        logEndTime = new Date(
          logStartTime.getTime() + calculatedDuration * 60 * 1000
        );
      } else if (endTime) {
        // Calculate start time from end time - duration
        logEndTime = new Date(endTime);
        logStartTime = new Date(
          logEndTime.getTime() - calculatedDuration * 60 * 1000
        );
      } else {
        // Use current time as end time, calculate start time
        logEndTime = new Date();
        logStartTime = new Date(
          logEndTime.getTime() - calculatedDuration * 60 * 1000
        );
      }
    }
    // Priority 2: Calculate duration from start/end times if no duration provided
    else if (startTime && endTime) {
      logStartTime = new Date(startTime);
      logEndTime = new Date(endTime);

      // Validate that end time is after start time
      if (logEndTime <= logStartTime) {
        return res.status(400).json({
          message: "End time must be after start time",
        });
      }

      const diffMs = logEndTime.getTime() - logStartTime.getTime();
      calculatedDuration = Math.max(1, Math.round(diffMs / (1000 * 60))); // At least 1 minute
    }
    // No valid duration or time range provided
    else {
      return res.status(400).json({
        message: "Either duration or both start/end time must be provided",
      });
    }

    // Final validation
    if (!calculatedDuration || calculatedDuration <= 0) {
      return res.status(400).json({
        message: "Duration must be greater than 0 minutes",
      });
    }

    // Set the calculated values
    timeLogData.duration = calculatedDuration;
    timeLogData.startTime = logStartTime;
    timeLogData.endTime = logEndTime;

    const timeLog = await TimeLog.create(timeLogData);

    // Populate before sending response
    await timeLog.populate([
      { path: "goal", select: "title category priority" },
      { path: "taskList", select: "name" },
      { path: "task", select: "title" },
    ]);

    res.status(201).json(timeLog);
  } catch (error) {
    console.error("Error creating time log:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update time log
export const updateTimeLog = async (req, res) => {
  try {
    const { timeLogId } = req.params;
    const updates = req.body;

    // Remove undefined values and clean strings
    const cleanUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        cleanUpdates[key] =
          typeof updates[key] === "string" ? updates[key].trim() : updates[key];
      }
    });

    // Recalculate duration if start/end times are updated
    if (cleanUpdates.startTime || cleanUpdates.endTime) {
      const timeLog = await TimeLog.findOne({
        _id: timeLogId,
        user: req.user._id,
      });

      if (timeLog) {
        const startTime = cleanUpdates.startTime
          ? new Date(cleanUpdates.startTime)
          : timeLog.startTime;
        const endTime = cleanUpdates.endTime
          ? new Date(cleanUpdates.endTime)
          : timeLog.endTime;

        if (startTime && endTime) {
          const diffMs = endTime - startTime;
          cleanUpdates.duration = Math.round(diffMs / (1000 * 60));
        }
      }
    }

    const timeLog = await TimeLog.findOneAndUpdate(
      { _id: timeLogId, user: req.user._id },
      cleanUpdates,
      { new: true }
    ).populate([
      { path: "goal", select: "title category priority" },
      { path: "taskList", select: "name" },
      { path: "task", select: "title" },
    ]);

    if (!timeLog) {
      return res.status(404).json({ message: "Time log not found" });
    }

    res.json(timeLog);
  } catch (error) {
    console.error("Error updating time log:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete time log
export const deleteTimeLog = async (req, res) => {
  try {
    const { timeLogId } = req.params;

    const timeLog = await TimeLog.findOneAndDelete({
      _id: timeLogId,
      user: req.user._id,
    });

    if (!timeLog) {
      return res.status(404).json({ message: "Time log not found" });
    }

    res.json({ message: "Time log deleted successfully" });
  } catch (error) {
    console.error("Error deleting time log:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get time statistics for goals
export const getTimeStats = async (req, res) => {
  try {
    const { goalId, period = "week" } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const matchFilter = {
      user: req.user._id,
      createdAt: { $gte: startDate },
    };

    if (goalId) {
      matchFilter.goal = new mongoose.Types.ObjectId(goalId);
    }

    const stats = await TimeLog.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: goalId ? null : "$goal",
          totalMinutes: { $sum: "$duration" },
          totalSessions: { $sum: 1 },
          avgSessionLength: { $avg: "$duration" },
          categories: {
            $push: {
              category: "$category",
              duration: "$duration",
            },
          },
        },
      },
      {
        $lookup: {
          from: "goals",
          localField: "_id",
          foreignField: "_id",
          as: "goal",
        },
      },
      {
        $addFields: {
          totalHours: { $divide: ["$totalMinutes", 60] },
          avgSessionHours: { $divide: ["$avgSessionLength", 60] },
        },
      },
    ]);

    // Process category breakdown
    const processedStats = stats.map((stat) => ({
      ...stat,
      categoryBreakdown: stat.categories.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.duration;
        return acc;
      }, {}),
    }));

    res.json(processedStats);
  } catch (error) {
    console.error("Error fetching time stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add this new function to get daily time logs for a specific goal
export const getDailyTimeStats = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { days = 30 } = req.query; // Default to last 30 days

    // Verify goal exists and belongs to user
    const goal = await Goal.findOne({
      _id: goalId,
      user: req.user._id,
    }).lean();

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const dailyStats = await TimeLog.aggregate([
      {
        $match: {
          user: req.user._id,
          goal: new mongoose.Types.ObjectId(goalId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalMinutes: { $sum: "$duration" },
          totalSessions: { $sum: 1 },
          categories: {
            $push: {
              category: "$category",
              duration: "$duration",
            },
          },
        },
      },
      {
        $addFields: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          totalHours: { $divide: ["$totalMinutes", 60] },
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    // Process category breakdown for each day
    const processedStats = dailyStats.map((stat) => ({
      ...stat,
      categoryBreakdown: stat.categories.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.duration;
        return acc;
      }, {}),
    }));

    res.json({
      goal: goal,
      dailyStats: processedStats,
      totalDays: processedStats.length,
    });
  } catch (error) {
    console.error("Error fetching daily time stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
