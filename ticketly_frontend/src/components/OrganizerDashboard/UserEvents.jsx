import React, { useEffect, useState } from "react";
import { getUserEvents } from "../../services/events/api";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const userEvents = await getUserEvents();
        setEvents(userEvents);
      } catch (err) {
        console.error("Error fetching user events:", err);
        setError("Failed to load user events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-light-primary dark:text-dark-text mb-8">
        My Events
      </h1>
      {events.length === 0 ? (
        <div className="text-center text-gray-500">No events created.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-light-background dark:bg-dark-background border-2 dark:border-blue-900 p-6 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-gray-900 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/events/actions/${event.id}`)} // Navigate to EventActions
            >
              <h2 className="text-2xl font-bold text-light-primary dark:text-dark-secondary mb-4">
                {event.name}
              </h2>
              <p className="text-light-text dark:text-dark-text mb-4">
                {new Date(event.date_time).toLocaleDateString("en-US", {
                  dateStyle: "full",
                })}{" "}
                at{" "}
                {new Date(event.date_time).toLocaleTimeString("en-US", {
                  timeStyle: "short",
                })}
              </p>
              <p className="text-light-text dark:text-dark-text">
                {event.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserEvents;
