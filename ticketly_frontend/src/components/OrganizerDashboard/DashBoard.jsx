import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import UserEvents from "./UserEvents";

const Dashboard = ({ children }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 bg-light-background dark:dark:bg-dark-background">
        <div className="p-4">
          <button
            onClick={handleGoBack}
            className="mb-4 px-4 py-2 bg-light-buttonBackground text-light-buttonText dark:bg-dark-buttonBackground dark:text-dark-buttonText rounded hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all"
          >
            Go Back
          </button>
          {children}
        </div>
        <UserEvents />
      </div>
    </div>
  );
};

export default Dashboard;
