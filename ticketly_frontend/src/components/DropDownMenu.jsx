import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";

const DropdownMenu = ({ isHost, onLogout, onClose }) => {
  const handleOptionClick = (callback) => {
    callback();
    onClose();
  };

  return (
    <div className="absolute top-16 right-4 bg-light-background dark:bg-dark-background shadow-lg rounded-lg p-2">
      <Link
        to="/profile"
        className="block px-4 py-2 text-light-text dark:text-dark-text hover:bg-light-secondary hover:text-dark-text dark:hover:bg-dark-secondary rounded-lg"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        Profile
      </Link>
      {isHost && (
        <Link
          to="/organizer-dashboard"
          className="block px-4 py-2 text-light-text dark:text-dark-text hover:bg-light-secondary hover:text-dark-text dark:hover:bg-dark-secondary rounded-lg"
          onClick={onClose}
        >
          Organizer Dashboard
        </Link>
      )}
      <Link
        to="/bookings"
        className="block px-4 py-2 text-light-text dark:text-dark-text hover:bg-light-secondary hover:text-dark-text dark:hover:bg-dark-secondary rounded-lg"
        onClick={onClose}
      >
        Bookings
      </Link>
      <button
        onClick={() => handleOptionClick(onLogout)}
        className="w-full px-4 py-2 text-light-text dark:text-dark-text hover:bg-light-secondary hover:text-dark-text dark:hover:bg-dark-secondary rounded-lg flex items-center"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default DropdownMenu;
