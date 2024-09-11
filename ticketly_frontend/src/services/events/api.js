import api from "../api";
import { refreshToken } from "../accounts/api";

export const fetchEvents = async () => {
  try {
    const response = await api.get("events/");
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching the events");
  }
};

export const fetchEventDetails = async (eventId) => {
  try {
    const response = await api.get(`events/${eventId}/`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching the event details");
  }
};

export const createEvent = async (formData, refreshNavbar) => {
  try {
    const response = await api.post("events/create/", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    refreshNavbar(); // Call the refreshNavbar callback after successful event creation
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        const response = await api.post("events/create/", formData, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        refreshNavbar(); // Call the refreshNavbar callback after successful event creation
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
    const {
      name,
      description,
      date_time,
      location,
      location_link,
      total_tickets,
      available_tickets,
    } = eventData;
    const response = await api.put(
      `events/${eventId}/update/`,
      {
        name: name,
        description: description,
        date_time: date_time,
        location: location,
        location_link: location_link,
        total_tickets: total_tickets,
        available_tickets: available_tickets,
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

export const addStaff = async (eventId, staffId) => {
  try {
    const response = await api.post(
      `events/${eventId}/staff/`,
      {
        staff: staffId,
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
      : new Error("An error occurred while adding staff to the event");
  }
};

export const getUserEvents = async () => {
  try {
    const response = await api.get("events/user/host/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching the user's events");
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`events/${eventId}/delete/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while deleting the event");
  }
};