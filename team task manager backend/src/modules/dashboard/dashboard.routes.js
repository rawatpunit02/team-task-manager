import { Router } from "express";
import { getDashboard } from "./dashboard.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getDashboard);

export default router;
