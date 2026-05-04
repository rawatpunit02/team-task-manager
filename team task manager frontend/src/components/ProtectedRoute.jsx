import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth.js";

const ProtectedRoute = ({ children }) => {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
