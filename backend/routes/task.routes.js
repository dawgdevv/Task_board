import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  getAllTaskLists,
  createTaskList,
  getTaskListsByGoal,
  getTasksByList,
  createTask,
  updateTask,
  deleteTaskList,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/lists", auth, getAllTaskLists);

router.post("/lists", auth, createTaskList);

router.get("/goal/:goalId/lists", auth, getTaskListsByGoal);

router.get("/list/:listId", auth, getTasksByList);

router.delete("/lists/:listId", auth, deleteTaskList);

router.post("/", auth, createTask);

router.put("/:taskId", auth, updateTask);

router.delete("/:taskId", auth, deleteTask);

export default router;
