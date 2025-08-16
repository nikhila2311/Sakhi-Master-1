'use client';

import React from "react";

export default function Greeting({ userFirstName }) {
  const getGreeting = () => {
    const currentTime = new Date().getHours();
    let src, greeting, message;

    if (currentTime >= 5 && currentTime < 12) {
      src = "morning";
      greeting = "Good Morning";
      message = "Start your day with a smile!";
    } else if (currentTime >= 12 && currentTime < 17) {
      src = "afternoon";
      greeting = "Good Afternoon";
      message = "Enjoy your afternoon!";
    } else if (currentTime >= 17 && currentTime < 21) {
      src = "evening";
      greeting = "Good Evening";
      message = "Have a pleasant evening!";
    } else {
      src = "night";
      greeting = "Good Night";
      message = "Have a peaceful sleep!";
    }

    return { src, greeting, message };
  };

  const { src, greeting, message } = getGreeting();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col items-center justify-center space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <img
          src={`/assets/dashboard/${src}.png`}
          className="h-12 w-12 scale-[2.5] sm:scale-[2] md:scale-[2.5]"
          alt={greeting}
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {greeting}, {userFirstName || "Guest"}
        </h2>
        <p className="italic text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
