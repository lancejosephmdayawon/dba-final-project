"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function HeaderBar() {
  const { data: session, status } = useSession();

  const [currentDate, setCurrentDate] = useState(new Date());

  // Update date every minute (optional)
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (status === "loading") return null;
  if (!session) return null;

  const username = session.user.first_name;

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = dayNames[currentDate.getDay()];
  const month = monthNames[currentDate.getMonth()];
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  return (
    <header className="w-full bg-blue-100 shadow-md p-4 flex flex-col justify-center border-b-2 border-white p-4">
      <span className="text-xl font-semibold text-gray-800">
        Welcome back, {username}!
      </span>
      <span className="text-sm text-gray-500">{`${day}, ${month} ${date}, ${year}`}</span>
    </header>
  );
}
