import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-light-secondary dark:bg-dark-secondary h-screen p-4 fixed">
      <h2 className="text-dark-buttonText text-2xl mb-4">Dashboard</h2>
      <ul>
        <li>
          <Link
            to="/organizer-dashboard"
            className="block text-dark-text p-2 rounded hover:bg-light-primary dark:hover:bg-dark-primary"
          >
            My Events
          </Link>
        </li>
        <li>
          <Link
            to="/bookings"
            className="block text-dark-text p-2 rounded hover:bg-light-primary dark:hover:bg-dark-primary"
          >
            Analytics
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
