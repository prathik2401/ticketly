import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllBookings } from "../../services/bookings/api";
import { fetchEvents } from "../../services/events/api";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getBookingsAndEvents = async () => {
      try {
        const [bookingsData, eventsData] = await Promise.all([
          fetchAllBookings(),
          fetchEvents(),
        ]);

        const eventsMap = eventsData.reduce((acc, event) => {
          acc[event.id] = event;
          return acc;
        }, {});

        setBookings(bookingsData);
        setEvents(eventsMap);
      } catch (err) {
        setError(err.message || "Failed to fetch bookings and events");
      } finally {
        setLoading(false);
      }
    };

    getBookingsAndEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleItemClick = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking) => {
            const event = events[booking.event];
            return (
              <li
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden md:flex cursor-pointer"
                onClick={() => handleItemClick(booking.id)}
              >
                <div className="md:w-1/3">
                  {event?.image ? (
                    <img
                      src={event.image}
                      alt={event.name || "Event Image"}
                      className="object-cover w-full h-48 md:h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-48 md:h-full bg-gray-200 dark:bg-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">
                        No image found
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1">
                  <h2 className="text-2xl font-semibold mb-3">
                    {event?.name || "Event Name"}
                  </h2>
                  <p className="text-lg mb-2">
                    Date:{" "}
                    {new Date(booking.date_time).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-lg mb-2">
                    Time:{" "}
                    {new Date(booking.date_time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-lg mb-2">
                    Location: {event?.location || "Location not available"}
                  </p>
                  <p className="text-lg mb-2">
                    Tickets: {booking.number_of_tickets}
                  </p>
                  <p
                    className={`text-lg font-medium mt-4 ${
                      booking.status === "Pending"
                        ? "text-yellow-600"
                        : booking.status === "Cancelled"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    Status: {booking.status}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BookingsList;
