import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-light-primary dark:bg-dark-primary text-light-buttonText dark:text-dark-buttonText p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl">
        Ticketly
      </Link>
      <div>
        <Link to="/profile" className="mx-2">
          Profile
        </Link>
        <button
          onClick={() => {
            /* Handle logout */
          }}
          className="bg-light-buttonBackground dark:bg-dark-buttonBackground text-light-buttonText dark:text-dark-buttonText p-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
