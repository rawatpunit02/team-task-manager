import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw ApiError.unauthorized("Not authenticated");

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user) throw ApiError.unauthorized("User no longer exists");

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error.message === "JWT_SECRET is not configured") {
      return next(error);
    }

    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden("You do not have permission to perform this action"),
      );
    }

    next();
  };
};

const isAdmin = authorize("admin");

export { authenticate, authorize, isAdmin };
