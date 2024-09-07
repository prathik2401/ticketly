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
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
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
  }
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

        {/* Apply blur to the background content only */}
        <div className={`${isAuthModalOpen ? "blur-sm" : ""}`}>
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
          </Routes>
        </div>

        {/* Login modal overlay */}
        {isAuthModalOpen && <LoginModal closeAuthModal={closeAuthModal} onLogin={handleLogin}/>}
      </Router>
    </div>
  );
};

export default App;
