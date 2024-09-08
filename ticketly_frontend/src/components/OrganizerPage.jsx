import React, { useState } from "react";
import { createEvent, createTicketTiers } from "../services/api"; // Import functions to handle API requests

const OrganizerPage = () => {
  const [step, setStep] = useState(1); // Track current step (1 or 2)
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [location, setLocation] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [eventImage, setEventImage] = useState(null); // Handle file input
  const [ticketTiers, setTicketTiers] = useState([{ name: "", price: "" }]);
  const [error, setError] = useState("");

  const handleEventNameChange = (e) => setEventName(e.target.value);
  const handleEventDescriptionChange = (e) =>
    setEventDescription(e.target.value);
  const handleEventDateTimeChange = (e) => setEventDateTime(e.target.value);
  const handleTotalTicketsChange = (e) => setTotalTickets(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleLocationLinkChange = (e) => setLocationLink(e.target.value);
  const handleEventImageChange = (e) => setEventImage(e.target.files[0]);

  const handleTicketTierChange = (index, e) => {
    const newTicketTiers = [...ticketTiers];
    newTicketTiers[index][e.target.name] = e.target.value;
    setTicketTiers(newTicketTiers);
  };

  const handleAddTicketTier = () => {
    if (ticketTiers.length < 3) {
      setTicketTiers([...ticketTiers, { name: "", price: "" }]);
    }
  };

  const handleRemoveTicketTier = (index) => {
    const newTicketTiers = ticketTiers.filter((_, i) => i !== index);
    setTicketTiers(newTicketTiers);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", eventName);
    formData.append("description", eventDescription);
    formData.append("date_and_time", eventDateTime);
    formData.append("total_tickets", totalTickets);
    formData.append("location", location);
    formData.append("location_link", locationLink);
    if (eventImage) formData.append("image", eventImage);

    try {
      const response = await createEvent(formData);
      if (response) {
        setStep(2); // Move to the next step
      }
    } catch (err) {
      setError("Failed to create event. Please try again.");
    }
  };

  const handleTicketTiersSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicketTiers(ticketTiers); // Assume this function handles the ticket tiers creation
      alert("Event and ticket tiers created successfully!");
    } catch (err) {
      setError("Failed to create ticket tiers. Please try again.");
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
    <div className="max-w-2xl mx-auto p-4">
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Create an Event</h1>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-2">
                Event Name:
              </label>
              <input
                type="text"
                value={eventName}
                onChange={handleEventNameChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Description:
              </label>
              <textarea
                value={eventDescription}
                onChange={handleEventDescriptionChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Location:
              </label>
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Event Image:
              </label>
              <input
                type="file"
                onChange={handleEventImageChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Submit Event Details
            </button>
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </form>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Add Ticket Tiers</h1>
          <form onSubmit={handleTicketTiersSubmit} className="space-y-4">
            {ticketTiers.map((tier, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-gray-300 rounded-md"
              >
                <label className="block text-md font-medium mb-1">
                  Ticket Tier Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={tier.name}
                  onChange={(e) => handleTicketTierChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <label className="block text-md font-medium mt-2 mb-1">
                  Price:
                </label>
                <input
                  type="number"
                  name="price"
                  value={tier.price}
                  onChange={(e) => handleTicketTierChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTicketTier(index)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTicketTier}
              disabled={ticketTiers.length >= 3}
              className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              Add Ticket Tier
            </button>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Submit Ticket Tiers
            </button>
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default OrganizerPage;
