// src/components/EventList.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/api";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await getEvents();
      setEvents(eventsData);
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Browse Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
