import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import { generateAccessToken } from "../../common/utils/jwt.utils.js";

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already registered");

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken({
    id: user._id.toString(),
    role: user.role,
  });

  return { user: toPublicUser(user), accessToken };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  const accessToken = generateAccessToken({
    id: user._id.toString(),
    role: user.role,
  });
  return { user: toPublicUser(user), accessToken };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return toPublicUser(user);
};

const getUsers = async (filter = {}) => {
  const query = {};
  if (filter.role) {
    if (!["admin", "member"].includes(filter.role)) {
      throw ApiError.badRequest("Invalid role filter");
    }
    query.role = filter.role;
  }

  const users = await User.find(query).sort({ name: 1 });
  return users.map(toPublicUser);
};

export { register, login, getMe, getUsers };
