import Project from "./project.model.js";
import User from "../auth/auth.model.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createProject = async (req, res) => {
  const { name, members = [] } = req.body;

  if (!Array.isArray(members)) {
    throw ApiError.badRequest("Members must be an array of user IDs");
  }

  const invalidMemberId = members.find((id) => !isValidObjectId(id));
  if (invalidMemberId) {
    throw ApiError.badRequest("One or more member IDs are invalid");
  }

  const users = await User.find({ _id: { $in: members } });
  if (users.length !== members.length) {
    throw ApiError.badRequest("One or more project members do not exist");
  }

  const adminMember = users.find((user) => user.role === "admin");
  if (adminMember) {
    throw ApiError.badRequest("Project members cannot include admin users");
  }

  const project = await Project.create({
    name,
    members,
    createdBy: req.user.id,
  });

  ApiResponse.created(res, "Project created successfully", project);
};

const getProjects = async (req, res) => {
  const query = req.user.role === "admin" ? {} : {
    $or: [{ createdBy: req.user.id }, { members: req.user.id }],
  };

  const projects = await Project.find(query)
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  ApiResponse.ok(res, "Projects fetched successfully", projects);
};

export { createProject, getProjects };
