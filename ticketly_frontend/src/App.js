import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventList from "./components/Events/EventList";
import EventDetails from "./components/Events/EventDetails";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import api from "./services/api";
import { getUserProfile } from "./services/accounts/api";
import Dashboard from "./components/OrganizerDashboard/DashBoard";
import BookingConfirmation from "./components/Booking/BookingConfirm";
import BookingsList from "./components/Booking/BookingDetails";
import UserProfile from "./components/UserProfile";
import CreateEvent from "./components/Events/CreateEvent";
import EventActions from "./components/OrganizerDashboard/EventActions";
import "./App.css";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      api
        .post("/accounts/verify-token/", { token: accessToken })
        .then(() => {
          setIsLoggedIn(true);
          fetchUserProfile();
        })
        .catch(() => setShowLoginModal(true));
    } else {
      setShowLoginModal(true);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setIsHost(userProfile.isHost);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    fetchUserProfile();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLoginModal(true);
  };

  const refreshNavbar = () => {
    fetchUserProfile();
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-dark-background text-dark-text"
          : "bg-light-background text-light-text"
      }`}
    >
      <Router>
        <Navbar
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          isLoggedIn={isLoggedIn}
          openAuthModal={() => setShowLoginModal(true)}
          handleLogout={handleLogout}
          isHost={isHost}
        />
        {showLoginModal && (
          <LoginModal
            closeAuthModal={() => setShowLoginModal(false)}
            onLogin={handleLogin}
          />
        )}
        <div>
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/organizer-dashboard" element={<Dashboard />} />
            <Route
              path="/bookings/:bookingId"
              element={<BookingConfirmation />}
            />
            <Route path="/bookings" element={<BookingsList />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route
              path="/create-event"
              element={<CreateEvent refreshNavbar={refreshNavbar} />}
            />
            <Route path="/events/actions/:eventId" element={<EventActions />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
