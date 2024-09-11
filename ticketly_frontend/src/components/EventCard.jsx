import React from "react";

// Helper function to add ordinal suffix to day
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Determine the ordinal suffix
  const suffix = (day) => {
    if (day > 3 && day < 21) return "th"; // All teen numbers get 'th'
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
};

const EventCard = ({ name, location, image, date, onClick }) => {
  return (
    <div
      className="relative mb-8 p-4 w-full max-w-sm md:max-w-md lg:max-w-lg flex flex-col md:flex-row lg:flex-col rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 dark:bg-dark-background bg-light-background dark:text-dark-text text-light-text cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full md:w-1/2 lg:w-full">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-48 md:h-64 lg:h-40 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 md:h-64 lg:h-40 bg-gray-300 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>
      <div className="p-4 w-full md:w-1/2 lg:w-full flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-medium mb-2">{name}</h2>
        <p className="mb-2 dark:text-gray-300 text-gray-600">{location}</p>
        <p className="dark:text-gray-400 text-gray-500">
          Date: {formatDate(date)}
        </p>
      </div>
      {/* Overlay for a creative effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-light-secondary dark:to-dark-secondary opacity-20 hover:opacity-40 transition-opacity duration-300 rounded-lg" />
    </div>
  );
};

export default EventCard;
