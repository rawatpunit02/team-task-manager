import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "./task.controller.js";
import { authenticate, isAdmin } from "../auth/auth.middleware.js";

const router = Router();

router.post("/", authenticate, isAdmin, createTask);
router.get("/", authenticate, getTasks);
router.patch("/:taskId/status", authenticate, updateTaskStatus);

export default router;
