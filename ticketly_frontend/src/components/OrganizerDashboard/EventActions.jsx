import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchEventDetails,
  deleteEvent,
  updateEvent,
} from "../../services/events/api"; // Import updateEvent
import { toast } from "react-toastify";
import Sidebar from "./SideBar";

const EventActions = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date_time: "",
    total_tickets: 1,
    available_tickets: 1, // Add available_tickets to the state
    ticket_price: 0,
    location: "",
    location_link: "",
  });
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode

  useEffect(() => {
    const getEvent = async () => {
      try {
        const event = await fetchEventDetails(eventId);
        setEventData(event);
        console.log(event);
      } catch (err) {
        console.error("Error fetching event:", err);
        toast.error("Failed to load event details. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    if (eventId) {
      getEvent();
    }
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateEvent(eventId, eventData);
      toast.success("Event updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating event:", err);
      toast.error("Failed to update event. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/organizer-dashboard");
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 bg-light-background dark:bg-dark-background">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8 text-center">
            Event Details
          </h1>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {eventData.name}
            </h2>
            {isEditing ? (
              <>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="datetime-local"
                  name="date_time"
                  value={eventData.date_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  name="location_link"
                  value={eventData.location_link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="ticket_price"
                  value={eventData.ticket_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="total_tickets"
                  value={eventData.total_tickets}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="available_tickets"
                  value={eventData.available_tickets}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ease-in-out"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 ease-in-out"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  {eventData.description}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Date and Time:{" "}
                  <span className="font-medium">
                    {new Date(eventData.date_time).toLocaleString()}
                  </span>
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Location: {eventData.location}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Location Link:{" "}
                  <a
                    href={eventData.location_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {eventData.location_link}
                  </a>
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Ticket Price: ₹{eventData.ticket_price}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Total Tickets: {eventData.total_tickets}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Available Tickets: {eventData.available_tickets}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                  >
                    Edit Event
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ease-in-out"
                  >
                    Delete Event
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventActions;
