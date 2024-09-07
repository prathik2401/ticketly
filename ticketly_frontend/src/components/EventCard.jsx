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

const EventCard = ({ name, location, image, date }) => {
  return (
    <div className="mb-8 w-full flex flex-row lg:flex-col rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image */}
      <div className="w-1/2 lg:w-full">
        <img
          src={image}
          alt={name}
          className="w-full h-48 md:h-64 lg:h-40 object-cover"
        />
      </div>

      {/* Text */}
      <div className="p-4 w-1/2 lg:w-full flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-medium mb-2">{name}</h2>
        <p className="text-gray-600 mb-2">{location}</p>
        <p className="text-gray-500">Date: {formatDate(date)}</p>
      </div>
    </div>
  );
};

export default EventCard;
