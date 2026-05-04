import Task from "../task/task.model.js";
import ApiResponse from "../../common/utils/api-response.js";

const getDashboard = async (req, res) => {
  const taskFilter = req.user.role === "admin" ? {} : { assignedTo: req.user.id };
  const now = new Date();

  const [totalTasks, completedTasks, overdueTasks] = await Promise.all([
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: "done" }),
    Task.countDocuments({
      ...taskFilter,
      status: { $in: ["todo", "in-progress"] },
    }),
  ]);

  ApiResponse.ok(res, "Dashboard fetched successfully", {
    totalTasks,
    completedTasks,
    overdueTasks,
  });
};

export { getDashboard };
