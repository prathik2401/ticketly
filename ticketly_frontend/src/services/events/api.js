import axios from "axios";
import { refreshToken } from "./accounts/api";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Origin: "https://ticketly-mu.vercel.app",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (error.response.data.code === "token_not_valid") {
        if (!isRefreshing) {
          isRefreshing = true;
          originalRequest._retry = true;

          try {
            const newAccessToken = await refreshToken(); // Refresh token API call
            localStorage.setItem("access", newAccessToken);

            api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);

            return api(originalRequest); // Retry original request with new token
          } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
