import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEventDetails, fetchEvents } from "../../services/events/api";
import EventCard from "./EventCard";
import LoginModal from "../LoginModal";

const S3_BUCKET_URL = process.env.REACT_APP_S3_BUCKET_URL;

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("A-Z");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 30;
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

  const sortedEvents = filteredEvents.sort((a, b) => {
    switch (sortOption) {
      case "A-Z":
        return a.name.localeCompare(b.name);
      case "Z-A":
        return b.name.localeCompare(a.name);
      case "Recently Posted":
        return new Date(b.date_time) - new Date(a.date_time);
      default:
        return 0;
    }
  });

  const checkAuthentication = () => {
    return localStorage.getItem("access");
  };

  const handleEventClick = (event) => {
    if (checkAuthentication()) {
      const formattedDate = formatDate(event.date_time);
      const formattedTime = formatTime(event.date_time);
      fetchEventDetails(event.id).then(() => {
        navigate(`/events/${event.id}`, {
          state: { formattedDate, formattedTime },
        });
      });
    } else {
      setRedirectAfterLogin(`/events/${event.id}`);
      setIsModalOpen(true);
    }
  };

  const handleLogin = () => {
    if (redirectAfterLogin) {
      navigate(redirectAfterLogin);
      setRedirectAfterLogin(null);
    }
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-6 py-12 dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text">
      <div className="mb-8">
        <h1 className="text-4xl font-bold dark:text-dark-text text-light-text mt-8 mb-6">
          Discover Events
        </h1>
        <div className="flex w-full justify-between items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search events by name, location, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-full p-3 pl-5 w-full md:w-2/3 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text focus:ring-2 focus:ring-primary"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-full p-3 pl-5 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text focus:ring-2 focus:ring-primary"
          >
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="Recently Posted">Recently Posted</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <EventCard
              key={event.id}
              name={event.name}
              location={event.location}
              image={getS3ImageUrl(event.image)}
              date={event.date_time}
              onClick={() => handleEventClick(event)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 w-full col-span-full">
            No events found.
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <nav>
          <ul className="flex list-none">
            {Array.from(
              { length: Math.ceil(sortedEvents.length / eventsPerPage) },
              (_, index) => (
                <li key={index} className="mx-1">
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-full ${
                      currentPage === index + 1
                        ? "bg-light-secondary text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

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
