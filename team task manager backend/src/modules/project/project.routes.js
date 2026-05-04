import { Router } from "express";
import { createProject, getProjects } from "./project.controller.js";
import { authenticate, isAdmin } from "../auth/auth.middleware.js";

const router = Router();

router.post("/", authenticate, isAdmin, createProject);
router.get("/", authenticate, getProjects);

export default router;
