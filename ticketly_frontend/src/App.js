import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import { checkAuthStatus } from "./services/api";
import "./App.css";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const verifyAuth = async () => {
      try {
        await checkAuthStatus();
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    verifyAuth();
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

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
          openAuthModal={openAuthModal}
          handleLogout={handleLogout}
        />
        <div className={`${isAuthModalOpen ? "blur-sm" : ""}`}>
          <Routes>
            <Route
              path="/"
              element={<EventList openAuthModal={openAuthModal} />}
            />
            <Route path="/events/:eventId" element={<EventDetails />} />
          </Routes>
        </div>
        {isAuthModalOpen && (
          <LoginModal closeAuthModal={closeAuthModal} onLogin={handleLogin} />
        )}
      </Router>
    </div>
  );
};

export default App;
