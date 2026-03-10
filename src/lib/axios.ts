import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { refreshAccessToken } from "../api/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().getRefreshToken();

        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        // Call the refresh API
        const response = await refreshAccessToken(refreshToken);

        if (response?.data?.accessToken) {
          // Save new tokens
          useAuthStore
            .getState()
            .setToken(response.data.accessToken, response.data.refreshToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        } else {
          // If no new token was generated
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh token failed
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
