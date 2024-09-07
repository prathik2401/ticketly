import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/api";
import EventCard from "./EventCard";

const S3_BUCKET_URL = process.env.REACT_APP_S3_BUCKET_URL;

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const hasFetchedEvents = useRef(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!hasFetchedEvents.current) {
        const eventsData = await getEvents();
        setEvents(eventsData);
        hasFetchedEvents.current = true;
      }
    };
    fetchEvents();
  }, []);

  const getS3ImageUrl = (imageUrl) => {
    try {
      const url = new URL(imageUrl);
      return `${S3_BUCKET_URL}${url.pathname}`;
    } catch (error) {
      console.error("Invalid URL:", imageUrl);
      return imageUrl;
    }
  };

  const filteredEvents = events.filter((event) => {
    const searchTerm = searchQuery.toLowerCase();
    const eventDate = new Date(event.date_and_time).toLocaleDateString("en-US");
    return (
      event.name.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm) ||
      eventDate.includes(searchTerm)
    );
  });

  return (
    <div className="container mx-auto">
      <div className="flex justify-left mb-8">
        <h1 className="text-3xl dark:dark-text mt-8">Browse Events</h1>
      </div>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search events by name, location, or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-full p-2 pl-5 w-full"
        />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <li key={event.id} className="w-full">
              <Link to={`/events/${event.id}`}>
                <EventCard
                  name={event.name}
                  location={event.location}
                  image={getS3ImageUrl(event.image)}
                  date={new Date(event.date_and_time).toLocaleDateString(
                    "en-US"
                  )}
                />
              </Link>
            </li>
          ))
        ) : (
          <div className="text-center text-gray-500">No events found.</div>
        )}
      </ul>
    </div>
  );
};

export default EventList;
