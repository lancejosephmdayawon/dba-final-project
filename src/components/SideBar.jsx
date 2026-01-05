"use client";
import { signOut } from "next-auth/react";
import { Calendar, CreditCard, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-100 to-blue-300 text-white h-screen p-4 flex flex-col">

      {/* Logo and Title */}
      <div className="flex justify-center h-32">
        <div className="flex items-center">
          <img src="/images/logo.png" alt="Logo" className="w-20 h-20 mr-2" />
          <div className="flex flex-col">
            <img
              src="/images/logoName.png"
              alt="Title"
              className="w-30 h-auto"
            />
            <span className="text-sm text-gray-700">Patient Portal</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <a className="flex items-center gap-2 py-2 px-4 text-gray-900 rounded hover:bg-gray-700">
          <Calendar className="w-5 h-5" /> My Appointments
        </a>

        <a className="flex items-center gap-2 py-2 px-4 text-gray-900 rounded hover:bg-gray-700">
          <CreditCard className="w-5 h-5" /> Payment
        </a>

        <a className="flex items-center gap-2 py-2 px-4 text-gray-900 rounded hover:bg-gray-700">
          <Settings className="w-5 h-5" /> Settings
        </a>
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-2 mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        <LogOut className="w-5 h-5" /> Log Out
      </button>
    </div>
  );
}
