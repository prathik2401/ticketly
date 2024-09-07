// src/components/EventDetails.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventDetails, bookTickets } from "../services/api";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const eventData = await getEventDetails(eventId);
      setEvent(eventData);
    };

    fetchEventDetails();
  }, [eventId]);

  const handleBooking = async () => {
    try {
      const bookingData = { number_of_tickets: ticketCount };
      await bookTickets(eventId, bookingData);
      alert("Tickets booked successfully!");
    } catch (error) {
      console.error("Error booking tickets:", error);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>Location: {event.location}</p>
      <p>Date and Time: {event.date_and_time}</p>
      <label>
        Number of Tickets:
        <input
          type="number"
          value={ticketCount}
          onChange={(e) => setTicketCount(e.target.value)}
        />
      </label>
      <button onClick={handleBooking}>Book Tickets</button>
    </div>
  );
};

export default EventDetails;
