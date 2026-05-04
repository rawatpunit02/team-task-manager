import axios from "axios";
import { clearAuth, getToken } from "../utils/auth.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
    });
  },
);

export default api;
