// src/services/api.js

import axios from "axios";

// Create an Axios instance with the base URL from .env
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async (email, password) => {
  const response = await api.post("/api/register/", {
    email: email,
    password: password,
  });
  return response.data;
};

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/api/token/", {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed", error.response.data);
    throw error;
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const response = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem("token", response.data.access); // Update access token
    return response.data;
  } catch (error) {
    console.error(
      "Error refreshing token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Auth Status
export const checkAuthStatus = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const response = await api.get("/api/verify-token/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      // Attempt to refresh token
      await refreshToken();
      // Retry checking auth status
      const retryResponse = await api.get("/api/verify-token/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return retryResponse;
    }
    console.error(
      "Error verifying token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  await api.post("/api/logout/");
};

// Fetch list of events
export const getEvents = async () => {
  const response = await api.get("/events/");
  return response.data;
};

// Fetch event details
// Fetch event details - prompt for login if unauthorized
export const getEventDetails = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Trigger login prompt when unauthorized
      throw new Error("Unauthorized - Please log in to view this event.");
    } else {
      console.error("Error fetching event details:", error);
      throw error;
    }
  }
};


// Book tickets for an event
export const bookTickets = async (eventId, bookingData) => {
  const response = await api.post(`/events/${eventId}/book/`, bookingData);
  return response.data;
};
