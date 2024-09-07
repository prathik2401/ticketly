import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventDetails, bookTickets, refreshToken } from "../services/api";
import { FaSpinner } from "react-icons/fa"; // Loading Spinner

const S3_BUCKET_URL = process.env.REACT_APP_S3_BUCKET_URL;

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await getEventDetails(eventId);
        setEvent(eventData);
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            await refreshToken();
            const eventData = await getEventDetails(eventId);
            setEvent(eventData);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            setError("Failed to load event details. Please log in again.");
          }
        } else {
          console.error("Error fetching event details:", err);
          setError("Failed to load event details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
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

  const getS3ImageUrl = (imageUrl) => {
    try {
      const url = new URL(imageUrl);
      return `${S3_BUCKET_URL}${url.pathname}`;
    } catch (error) {
      console.error("Invalid URL:", imageUrl);
      return imageUrl;
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
        <img
          src={getS3ImageUrl(event.image)}
          alt={event.name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
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
              {new Date(event.date_and_time).toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </div>
            <div className="text-lg text-light-text dark:text-dark-text mb-6">
              <span className="font-semibold">Available Tickets:</span>{" "}
              {event.availableTickets > 0 ? event.availableTickets : "Sold Out"}
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
                value={ticketCount}
                onChange={(e) => setTicketCount(e.target.value)}
                className="w-full px-4 py-3 border border-light-primary dark:border-dark-primary text-dark-primary dark:text-dark-buttonText bg-light-background dark:bg-dark-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <button
              onClick={handleBooking}
              className="w-full bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText font-bold py-3 px-4 rounded-md hover:bg-light-primary dark:hover:bg-dark-primary focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
            >
              Book Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
