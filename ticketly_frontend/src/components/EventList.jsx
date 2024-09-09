import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEventDetails, fetchEvents } from "../services/events/api";
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
    const getEvents = async () => {
      if (!hasFetchedEvents.current) {
        try {
          const eventsData = await fetchEvents();
          setEvents(eventsData);
          hasFetchedEvents.current = true;
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    };
    getEvents();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredEvents = events.filter((event) => {
    const searchTerm = searchQuery.toLowerCase();
    const eventDate = new Date(event.date_time).toLocaleDateString("en-US");
    return (
      event.name.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm) ||
      eventDate.includes(searchTerm)
    );
  });

  const checkAuthentication = () => {
    return localStorage.getItem("access");
  };

  const handleEventClick = (eventId) => {
    if (checkAuthentication()) {
      const eventDetails = fetchEventDetails(eventId);
      navigate(`/events/${eventId}`);
      return eventDetails;
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
    <div className="container mx-auto dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text">
      <div className="flex justify-left mb-8">
        <h1 className="text-3xl dark:text-dark-text text-light-text mt-8">
          Browse Events
        </h1>
      </div>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search events by name, location, or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-full p-2 pl-5 w-full bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
        />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <li key={event.id} className="w-full">
              <div
                className="cursor-pointer hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors p-4 rounded-lg"
                onClick={() => handleEventClick(event.id)}
              >
                <EventCard
                  name={event.name}
                  location={event.location}
                  image={getS3ImageUrl(event.image)}
                  date={`Date: ${formatDate(event.date_time)}`}
                  time={`Time: ${formatTime(event.date_time)}`}
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
