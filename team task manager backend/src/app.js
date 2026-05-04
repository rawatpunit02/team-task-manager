import cors from "cors";
import express from "express";
import authRoute from "./modules/auth/auth.routes.js";
import dashboardRoute from "./modules/dashboard/dashboard.routes.js";
import projectRoute from "./modules/project/project.routes.js";
import taskRoute from "./modules/task/task.routes.js";
import ApiError from "./common/utils/api-error.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/dashboard", dashboardRoute);
app.use("/api/projects", projectRoute);
app.use("/api/tasks", taskRoute);

app.all("{*path}", (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
