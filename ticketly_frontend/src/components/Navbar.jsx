import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from "../services/accounts/api";
import { Link, useNavigate } from "react-router-dom";
import DropdownMenu from "./DropDownMenu";

const Navbar = ({
  toggleDarkMode,
  isDarkMode,
  isLoggedIn,
  openAuthModal,
  handleLogout,
  isHost,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      handleLogout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleHostEventClick = () => {
    navigate("/create-event");
  };

  return (
    <nav className="relative flex justify-between items-center p-4 bg-light-background dark:bg-dark-background">
      <Link to="/" className="text-xl">
        <div className="text-2xl text-light-primary dark:text-dark-text font-bold">
          Ticketly
        </div>
      </Link>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 text-light-buttonBackground dark:text-dark-buttonText rounded"
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>

        <button
          onClick={handleHostEventClick}
          className="p-2 bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText rounded-lg"
        >
          Host an Event
        </button>

        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 flex justify-center items-center rounded-full bg-light-buttonBackground dark:bg-dark-buttonBackground"
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-light-buttonText dark:text-dark-buttonText"
                size="2x"
              />
            </button>
            {isDropdownOpen && (
              <DropdownMenu
                isHost={isHost}
                onLogout={handleLogoutClick}
                onClose={() => setIsDropdownOpen(false)}
              />
            )}
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="p-2 bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText rounded-lg"
          >
            Log In / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
