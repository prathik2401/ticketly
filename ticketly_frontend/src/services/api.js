// src/services/api.js

import axios from "axios";

// Create an Axios instance with the base URL from .env
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Set up an interceptor to attach the token to every request
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

// Authentication

// Sign Up
export const registerUser = async (email, password) => {
  const response = await api.post("/api/register/", {
    email: email,
    password: password,
  });
  return response.data;
};

// Login
// src/services/api.js
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
export const getEventDetails = async (eventId) => {
  const response = await api.get(`/events/${eventId}/`);
  return response.data;
};

// Book tickets for an event
export const bookTickets = async (eventId, bookingData) => {
  const response = await api.post(`/events/${eventId}/book/`, bookingData);
  return response.data;
};
