// src/components/AdminBookings.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { adminFetchAllBookings } from "../../services/bookings/api";

const AdminBookings = () => {
  const { eventId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await adminFetchAllBookings(eventId);
        console.log(response.data);
        setBookings(response.data || []); // Ensure bookings is an array
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [eventId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Event Bookings</h1>
      <div className="bg-white shadow-lg dark:bg-dark-primary rounded-lg p-6">
        {bookings.length === 0 ? (
          <p>No bookings found for this event.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">User</th>
                <th className="py-2">Number of Tickets</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="py-2">{booking.user.username}</td>
                  <td className="py-2">{booking.number_of_tickets}</td>
                  <td className="py-2">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
