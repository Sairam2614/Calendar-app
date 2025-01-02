import React from "react";

const NotificationBadge = ({ count, label, color }) => {
  // Define the color class dynamically based on the "color" prop
  const colorClass =
    color === "red"
      ? "bg-red-500"
      : color === "yellow"
      ? "bg-yellow-500"
      : "bg-gray-500";

  return (
    <div className="flex items-center justify-between bg-white border border-gray-300 p-4 rounded-lg shadow-md w-full">
      <div className="font-poppins">
        <h3 className="text-lg font-semibold truncate">{label}</h3>
        <p className="text-gray-600 text-sm hidden md:block">View and manage tasks</p>
      </div>
      <span
        className={`${colorClass} text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full`}
      >
        {count}
      </span>
    </div>
  );
};

export default NotificationBadge;
