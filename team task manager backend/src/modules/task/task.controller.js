import mongoose from "mongoose";
import Task from "./task.model.js";
import Project from "../project/project.model.js";
import User from "../auth/auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import ApiResponse from "../../common/utils/api-response.js";

const validStatuses = ["todo", "in-progress", "done"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createTask = async (req, res) => {
  const {
    title,
    description = "",
    projectId,
    assignedTo,
    status = "todo",
    dueDate,
  } = req.body;

  if (!title || !projectId || !assignedTo) {
    throw ApiError.badRequest("title, projectId and assignedTo are required");
  }

  if (!isValidObjectId(projectId) || !isValidObjectId(assignedTo)) {
    throw ApiError.badRequest("Invalid projectId or assignedTo");
  }

  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest("Invalid task status");
  }

  if (dueDate && Number.isNaN(new Date(dueDate).getTime())) {
    throw ApiError.badRequest("Invalid dueDate");
  }

  const [project, assignedUser] = await Promise.all([
    Project.findById(projectId),
    User.findById(assignedTo),
  ]);

  if (!project) throw ApiError.notFound("Project not found");
  if (!assignedUser) throw ApiError.badRequest("Assigned user does not exist");
  if (assignedUser.role !== "member") {
    throw ApiError.badRequest("Task can only be assigned to member users");
  }

  const projectUsers = [
    project.createdBy.toString(),
    ...project.members.map((memberId) => memberId.toString()),
  ];

  if (!projectUsers.includes(assignedTo.toString())) {
    throw ApiError.badRequest("Assigned user must belong to the project");
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo,
    status,
    dueDate,
  });

  ApiResponse.created(res, "Task created successfully", task);
};

const getTasks = async (req, res) => {
  const query = req.user.role === "admin" ? {} : { assignedTo: req.user.id };
  const tasks = await Task.find(query)
    .populate("assignedTo", "name email role")
    .populate("projectId", "name")
    .sort({ createdAt: -1 });

  ApiResponse.ok(res, "Tasks fetched successfully", tasks);
};

const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(taskId)) {
    throw ApiError.badRequest("Invalid task id");
  }

  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest("Invalid task status");
  }

  const task = await Task.findById(taskId);
  if (!task) throw ApiError.notFound("Task not found");

  const isAssignedUser = task.assignedTo.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isAssignedUser && !isAdmin) {
    throw ApiError.forbidden("You cannot update this task");
  }

  task.status = status;
  await task.save();

  ApiResponse.ok(res, "Task status updated successfully", task);
};

export { createTask, getTasks, updateTaskStatus };
