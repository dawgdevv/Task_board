import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  register,
  login,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);

export default router;
