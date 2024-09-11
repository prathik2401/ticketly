import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventDetails, getUserEvents } from "../services/events/api";
import { refreshToken } from "../services/accounts/api";
import { bookEvent } from "../services/bookings/api";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const S3_BUCKET_URL = process.env.REACT_APP_S3_BUCKET_URL;

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [isUserEvent, setIsUserEvent] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const getEventDetails = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Please log in to view event details.");
          return;
        }

        const eventData = await fetchEventDetails(eventId);
        setEvent(eventData);
        setFormattedDate(
          new Date(eventData.date_time).toLocaleDateString("en-US", {
            dateStyle: "full",
          })
        );
        setFormattedTime(
          new Date(eventData.date_time).toLocaleTimeString("en-US", {
            timeStyle: "short",
          })
        );

        // Fetch user events and check if the current event is created by the user
        const userEvents = await getUserEvents();
        const isUserEvent = userEvents.some(
          (userEvent) => userEvent.id === eventId
        );
        setIsUserEvent(isUserEvent);
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            await refreshToken();
            const eventData = await fetchEventDetails(eventId);
            setEvent(eventData);
            setFormattedDate(
              new Date(eventData.date_time).toLocaleDateString("en-US", {
                dateStyle: "full",
              })
            );
            setFormattedTime(
              new Date(eventData.date_time).toLocaleTimeString("en-US", {
                timeStyle: "short",
              })
            );

            // Fetch user events and check if the current event is created by the user
            const userEvents = await getUserEvents();
            const isUserEvent = userEvents.some(
              (userEvent) => userEvent.id === eventId
            );
            setIsUserEvent(isUserEvent);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            setError("Failed to load event details. Please log in again.");
          }
        } else {
          console.error("Error fetching event details:", err);
          setError("Failed to load event details. Log In to create an event.");
        }
      } finally {
        setLoading(false);
      }
    };

    getEventDetails();
  }, [eventId]);

  const handleBooking = async () => {
    const ticketCountInt = parseInt(ticketCount, 10);
    if (ticketCountInt <= 0 || ticketCountInt > event.available_tickets) {
      setBookingError("Please enter a valid number of tickets.");
      return;
    }

    try {
      const bookingData = await bookEvent(eventId, ticketCountInt);
      toast.success("Tickets booked successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setBookingError(null);
      navigate(`/bookings/${bookingData.booking_id}/`);
    } catch (error) {
      console.error("Error booking tickets:", error);
      toast.error("Failed to book tickets. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setBookingError("Failed to book tickets. Please try again.");
    }
  };

  const getS3ImageUrl = (imageUrl) => {
    try {
      const url = new URL(imageUrl);
      return `${S3_BUCKET_URL}${url.pathname}`;
    } catch (error) {
      return null;
    }
  };

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
      <div className="relative w-full h-96">
        {event.image !== "null" ? (
          <img
            src={getS3ImageUrl(event.image)}
            alt={event.name}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-lg shadow-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
        <h1 className="absolute bottom-6 left-6 text-5xl font-extrabold text-white drop-shadow-lg">
          {event.name}
        </h1>
      </div>

      <div className="bg-light-background dark:bg-dark-background shadow-lg rounded-lg p-8 mt-8 transition duration-300 ease-in-out transform hover:shadow-xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <p className="text-lg text-light-text dark:text-dark-text mb-8 leading-relaxed">
              {event.description}
            </p>
            <div className="text-lg text-light-text dark:text-dark-text mb-4">
              <span className="font-semibold">Location:</span> {event.location}
            </div>
            <div className="text-lg text-light-text dark:text-dark-text mb-6">
              <span className="font-semibold">Date and Time:</span>{" "}
              {formattedDate} at {formattedTime}
            </div>
            <div className="text-lg text-light-text dark:text-dark-text mb-6">
              <span className="font-semibold">Available Tickets:</span>{" "}
              {event.available_tickets > 0
                ? event.available_tickets
                : "Sold Out"}
            </div>
          </div>
          <div className="flex-1 bg-light-secondary dark:bg-dark-secondary p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-dark-text mb-4">
              Book Tickets
            </h2>
            <div className="mb-6">
              <label className="block text-dark-text font-medium mb-2">
                Number of Tickets:
              </label>
              <input
                type="number"
                min="1"
                max={event.available_tickets}
                value={ticketCount}
                onChange={(e) => setTicketCount(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 border border-light-primary dark:border-dark-primary text-dark-primary dark:text-dark-buttonText bg-light-background dark:bg-dark-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              {bookingError && (
                <p className="text-red-500 mt-2">{bookingError}</p>
              )}
            </div>
            <button
              onClick={handleBooking}
              className="w-full bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText font-bold py-3 px-4 rounded-md hover:bg-light-primary dark:hover:bg-dark-primary focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
              disabled={event.available_tickets === 0 || isUserEvent}
            >
              {event.available_tickets > 0
                ? isUserEvent
                  ? "You cannot book your own event"
                  : "Book Tickets"
                : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventDetails;
