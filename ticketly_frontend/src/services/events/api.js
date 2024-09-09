import api from "../api";
import { refreshToken } from "../accounts/api";

export const fetchEvents = async () => {
  try {
    const response = await api.get("/events/");
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching the events");
  }
};

export const fetchEventDetails = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching the event details");
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post(
      "/events",
      {
        event: eventData,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        const response = await api.post(
          "/events",
          {
            event: eventData,
          },
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );
        return response.data;
      } catch (refreshError) {
        throw refreshError.response
          ? refreshError.response.data
          : new Error("An error occurred while refreshing the token");
      }
    }
    throw error.response
      ? error.response.data
      : new Error("An error occurred while creating the event");
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(
      `/events/${eventId}/update/`,
      {
        event: eventData,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while updating the event");
  }
};