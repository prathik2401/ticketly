import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchBookingDetails } from "../../services/bookings/api";
import { fetchEventDetails } from "../../services/events/api";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookingAndEventDetails = async () => {
      try {
        const bookingData = await fetchBookingDetails(bookingId);
        setBookingDetails(bookingData);
        const eventData = await fetchEventDetails(bookingData.event);
        setEventDetails(eventData);
      } catch (err) {
        setError("Failed to fetch booking or event details.");
      } finally {
        setLoading(false);
      }
    };

    getBookingAndEventDetails();
  }, [bookingId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Booking Confirmation</h1>
      <div className="bg-white shadow-lg dark:bg-dark-primary rounded-lg p-6 flex flex-col md:flex-row">
        {/* Event Image Section */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          {eventDetails?.image ? (
            <img
              src={eventDetails.image}
              alt={eventDetails.name || "Event Image"}
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">
                No image found
              </span>
            </div>
          )}
        </div>

        {/* Booking Details Section */}
        <div className="w-full md:w-2/3 pl-0 md:pl-6 text-light-text dark:text-dark-text relative">
          <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
          <p>
            <strong>Event:</strong> {eventDetails?.name || "Event Name"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(bookingDetails.date_time).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            <strong>Time:</strong>{" "}
            {new Date(bookingDetails.date_time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {eventDetails?.location || "Location not available"}
          </p>
          <p>
            <strong>Location Link:</strong>{" "}
            {eventDetails?.location_link ? (
              <a
                href={eventDetails.location_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {eventDetails.location_link}
              </a>
            ) : (
              "Location link not available"
            )}
          </p>
          <p>
            <strong>Tickets:</strong> {bookingDetails.number_of_tickets}
          </p>
          <p>
            <strong>Status:</strong> {bookingDetails.status}
          </p>
          {bookingDetails.qr_code_url && (
            <div className="mt-4 md:absolute md:bottom-0 md:right-0 md:mb-4 md:mr-4">
              <h3 className="text-xl font-semibold mb-2">QR Code</h3>
              <img
                src={bookingDetails.qr_code_url}
                alt="QR Code"
                className="w-44 h-44 mx-auto md:mx-0"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
