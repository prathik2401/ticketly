import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import api from "./services/api";
import "./App.css";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
        .then(() => setIsLoggedIn(true))
        .catch(() => setShowLoginModal(true));
    } else {
      setShowLoginModal(true);
    }
  }, []);

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
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setShowLoginModal(true);
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
          openAuthModal={() => setShowLoginModal(true)} // Pass the openAuthModal function
          handleLogout={handleLogout}
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
            <Route path="/events/:eventId" element={<EventDetails />} />{" "}
            {/* Dynamic Route for Event Details */}
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
