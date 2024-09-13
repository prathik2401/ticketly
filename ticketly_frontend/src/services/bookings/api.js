import api from "../api";

export const bookEvent = async (eventId, numberOfTickets) => {
  try {
    const response = await api.post(
      `bookings/events/${eventId}/book/`,
      {
        number_of_tickets: numberOfTickets,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          Origin: "https://ticketly-mu.vercel.app",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while booking the event");
  }
};

export const fetchBookingDetails = async (bookingId) => {
  try {
    const response = await api.get(`bookings/${bookingId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        Origin: "https://ticketly-mu.vercel.app",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching booking details");
  }
};

export const fetchAllBookings = async () => {
  try {
    const response = await api.get("bookings/user/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        Origin: "https://ticketly-mu.vercel.app",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching bookings");
  }
};

export const adminFetchAllBookings = async (eventId) => {
  try {
    const response = await api.get(`bookings/events/${eventId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        Origin: "https://ticketly-mu.vercel.app",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An error occurred while fetching bookings");
  }
};
