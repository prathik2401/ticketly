import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/api";
import EventCard from "./EventCard";
import LoginModal from "./LoginModal";

const S3_BUCKET_URL = process.env.REACT_APP_S3_BUCKET_URL;

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const hasFetchedEvents = useRef(false);
  const navigate = useNavigate();

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

  const checkAuthentication = () => {
    return localStorage.getItem("token"); // Adjust based on how you handle authentication
  };

  const handleEventClick = (eventId) => {
    if (checkAuthentication()) {
      // User is authenticated, navigate directly to the event details
      navigate(`/events/${eventId}`);
    } else {
      // User is not authenticated, open the login modal
      setRedirectAfterLogin(`/events/${eventId}`);
      setIsModalOpen(true);
    }
  };

  const handleLogin = () => {
    if (redirectAfterLogin) {
      navigate(redirectAfterLogin);
      setRedirectAfterLogin(null);
    }
  };

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
              <div onClick={() => handleEventClick(event.id)}>
                <EventCard
                  name={event.name}
                  location={event.location}
                  image={getS3ImageUrl(event.image)}
                  date={new Date(event.date_and_time).toLocaleDateString(
                    "en-US"
                  )}
                />
              </div>
            </li>
          ))
        ) : (
          <div className="text-center text-gray-500">No events found.</div>
        )}
      </ul>

      {isModalOpen && (
        <LoginModal
          closeAuthModal={() => setIsModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default EventList;
