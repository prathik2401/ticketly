import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar";
import UserEvents from "./UserEvents";
import EventActions from "./EventActions";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleGoBack = () => {
    navigate("/");
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="flex">
      {/* Sidebar - stays fixed on the left side */}
      <Sidebar />
      <div className="flex-1 ml-64 bg-light-background dark:bg-dark-background">
        <div className="p-4">
          <button
            onClick={handleGoBack}
            className="mb-4 px-4 py-2 bg-light-buttonBackground text-light-buttonText dark:bg-dark-buttonBackground dark:text-dark-buttonText rounded hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all"
          >
            Go Back
          </button>
          {/* Render either EventActions or UserEvents */}
          {selectedEvent ? (
            <EventActions event={selectedEvent} />
          ) : (
            <UserEvents onEventSelect={handleEventSelect} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
