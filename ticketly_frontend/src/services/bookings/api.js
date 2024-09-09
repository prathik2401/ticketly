import api from "../api";

export const bookEvent = async (eventId, numberOfTickets) => {
  try {
    const response = await api.post(
      `/bookings/events/${eventId}/book/`,
      {
        number_of_tickets: numberOfTickets,
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
      : new Error("An error occurred while booking the event");
  }
};
