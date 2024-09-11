import React, { useState } from "react";
import { createEvent } from "../services/events/api";

const OrganizerPage = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [availableTickets, setAvailableTickets] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [location, setLocation] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [eventImage, setEventImage] = useState(null); // Handle file input
  const [error, setError] = useState("");

  const handleEventNameChange = (e) => setEventName(e.target.value);
  const handleEventDescriptionChange = (e) =>
    setEventDescription(e.target.value);
  const handleEventDateTimeChange = (e) => setEventDateTime(e.target.value);
  const handleTotalTicketsChange = (e) => setTotalTickets(e.target.value);
  const handleAvailableTicketsChange = (e) =>
    setAvailableTickets(e.target.value);
  const handleTicketPriceChange = (e) => setTicketPrice(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleLocationLinkChange = (e) => setLocationLink(e.target.value);
  const handleEventImageChange = (e) => setEventImage(e.target.files[0]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", eventName);
    formData.append("description", eventDescription);
    formData.append("date_and_time", eventDateTime);
    formData.append("total_tickets", totalTickets);
    formData.append("available_tickets", availableTickets);
    formData.append("ticket_price", ticketPrice);
    formData.append("location", location);
    formData.append("location_link", locationLink);
    if (eventImage) formData.append("image", eventImage);

    try {
      const response = await createEvent(formData);
      if (response) {
        alert("Event created successfully!");
      }
    } catch (err) {
      setError("Failed to create event. Please try again.");
    }
  };

  const today = new Date();
  const minDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 2
  );
  const minDateString = minDate.toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-light-background dark:dark:bg-dark-background text-light-text dark:text-dark-text">
      <h1 className="text-2xl font-bold mb-4">Create an Event</h1>
      <form onSubmit={handleEventSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2">Event Name:</label>
          <input
            type="text"
            value={eventName}
            onChange={handleEventNameChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Description:</label>
          <textarea
            value={eventDescription}
            onChange={handleEventDescriptionChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Date and Time:
          </label>
          <input
            type="datetime-local"
            value={eventDateTime}
            onChange={handleEventDateTimeChange}
            required
            min={minDateString} // Set minimum date and time
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Total Tickets:
          </label>
          <input
            type="number"
            value={totalTickets}
            onChange={handleTotalTicketsChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Available Tickets:
          </label>
          <input
            type="number"
            value={availableTickets}
            onChange={handleAvailableTicketsChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Ticket Price:
          </label>
          <input
            type="number"
            value={ticketPrice}
            onChange={handleTicketPriceChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Location:</label>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">
            Location Link:
          </label>
          <input
            type="url"
            value={locationLink}
            onChange={handleLocationLinkChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Event Image:</label>
          <input
            type="file"
            onChange={handleEventImageChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-light-background text-light-text dark:dark:bg-dark-background dark:text-dark-text dark:border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-light-primary text-light-buttonText dark:bg-dark-primary dark:text-dark-buttonText p-2 rounded-md hover:bg-light-primary-dark dark:hover:bg-dark-primary-dark"
        >
          Submit Event Details
        </button>
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default OrganizerPage;
