import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from "../services/accounts/api";
import { Link } from "react-router-dom";

const Navbar = ({
  toggleDarkMode,
  isDarkMode,
  isLoggedIn,
  openAuthModal,
  handleLogout,
}) => {
  const handleLogoutClick = async () => {
    try {
      await logoutUser(); // Call the logout function
      localStorage.removeItem("token"); // Remove the token from local storage
      handleLogout(); // Update state to reflect logged out status
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-light-background dark:bg-dark-background">
      <Link to="/" className="text-xl">
        <div className="text-2xl font-bold">Ticketly</div>
      </Link>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 text-light-buttonBackground dark:text-dark-buttonText rounded"
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>

        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogoutClick}
              className="p-2 bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText rounded-lg"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
            <button className="w-10 h-10 flex justify-center items-center rounded-full bg-light-buttonBackground dark:bg-dark-buttonBackground">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-light-buttonText dark:text-dark-buttonText"
                size="2x"
              />
            </button>
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
