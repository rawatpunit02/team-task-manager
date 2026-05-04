import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
  const data = await authService.register(req.body);
  ApiResponse.created(res, "Registration successful", data);
};

const login = async (req, res) => {
  const data = await authService.login(req.body);
  ApiResponse.ok(res, "Login successful", data);
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "User profile", user);
};

const getUsers = async (req, res) => {
  const role = req.query.role;
  const users = await authService.getUsers({ role });
  ApiResponse.ok(res, "Users fetched successfully", users);
};

export { register, login, getMe, getUsers };
