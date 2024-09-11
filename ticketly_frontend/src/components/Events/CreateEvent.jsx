import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/events/api";
import { refreshToken } from "../../services/accounts/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginModal from "../LoginModal"; // Import the LoginModal component

const CreateEvent = ({ refreshNavbar }) => {
  // Add refreshNavbar prop
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date_time: "",
    location: "",
    location_link: "",
    ticket_amount: "", // Add ticket amount to the state
    total_tickets: "", // Add total tickets to the state
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false); // State to control login modal visibility

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        setIsLoggedIn(false);
        setError("Please log in to create an event.");
        setShowLoginModal(true); // Show login modal if not logged in
        return;
      }

      try {
        await refreshToken();
      } catch (err) {
        console.error("Error refreshing token:", err);
        setIsLoggedIn(false);
        setError("Failed to verify login status. Please log in again.");
        setShowLoginModal(true); // Show login modal if token refresh fails
      }
    };

    checkLoginStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ticket_amount" && value.length > 5) {
      return;
    }
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    for (const key in eventData) {
      formData.append(key, eventData[key]);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      await createEvent(formData, refreshNavbar); // Pass refreshNavbar to createEvent
      toast.success("Event created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setEventData({
        name: "",
        description: "",
        date_time: "",
        location: "",
        location_link: "",
        ticket_amount: "", // Reset ticket amount
        total_tickets: "", // Reset total tickets
      });
      setImage(null);
      navigate("/organizer-dashboard"); // Navigate to organizer dashboard
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create event. Please try again.");
      toast.error("Failed to create event. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  if (!isLoggedIn) {
    return (
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setShowLoginModal(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary mb-8">
        Create Event
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label
            className="block text-light-text dark:text-dark-text font-medium mb-2"
            htmlFor="name"
          >
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-light-text dark:text-dark-text font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 text-light-text border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-light-text dark:text-dark-text font-medium mb-2"
            htmlFor="date_time"
          >
            Date and Time
          </label>
          <input
            type="datetime-local"
            id="date_time"
            name="date_time"
            value={eventData.date_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-light-text border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min={getMinDateTime()}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-light-text dark:text-dark-text font-medium mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-light-text border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-light-text dark:text-dark-text font-medium mb-2"
            htmlFor="location_link"
          >
            Location Link
          </label>
          <input
            type="url"
            id="location_link"
            name="location_link"
            value={eventData.location_link}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-light-text border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-light-text dark:text-dark-text font-medium mb-2"
            htmlFor="ticket_amount"
          >
            Ticket Amount
          </label>
          <input
            type="number"
            id="ticket_amount"
            name="ticket_amount"
            value={eventData.ticket_amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-light-text border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength="5" // Ensure the ticket amount does not exceed 5 digits
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-light-text dark:text-dark-text font-medium mb-2"
            htmlFor="total_tickets"
          >
            Total Tickets
          </label>
          <input
            type="number"
            id="total_tickets"
            name="total_tickets"
            value={eventData.total_tickets}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-light-text border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-light-text dark:text-dark-text font-medium mb-2"
            htmlFor="image"
          >
            Event Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-light-primary dark:border-dark-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText font-bold py-3 px-4 rounded-md hover:bg-light-primary dark:hover:bg-dark-primary focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEvent;
