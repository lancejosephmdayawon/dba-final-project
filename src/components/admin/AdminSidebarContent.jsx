// AdminSidebarContent.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Calendar, Users, LogOut, HandCoins, Settings } from "lucide-react";

export default function AdminSidebarContent({ session }) {
  const pathname = usePathname();

  const username = session.user.first_name || session.user.name;
  const userInitial = username.charAt(0).toUpperCase();

  const navItems = [
    { label: "Appointments", href: "appointments", icon: Calendar },
    { label: "Patients", href: "patients", icon: Users },
    { label: "Payments", href: "payments", icon: HandCoins },
    { label: "Settings", href: "settings", icon: Settings },
  ];

  const normalize = (url) => url.replace(/\/$/, "");

  return (
    <div className="w-64 bg-gradient-to-b from-gray-100 to-gray-300 h-screen p-4 flex flex-col">

      {/* LOGO SECTION */}
      <div className="flex justify-center h-32 mb-4">
        <div className="flex items-center">
          <img src="/images/logo.png" alt="Logo" className="w-20 h-20 mr-2" />
          <div className="flex flex-col">
            <img src="/images/logoName.png" alt="Title" className="w-30 h-auto" />
            <span className="text-sm text-gray-700">Admin Dashboard</span>
          </div>
        </div>
      </div>

      {/* USER CARD */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-md mb-6 shadow">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
          {userInitial}
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{username}</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const fullHref = `/admin/${href}`;
          const isActive =
            normalize(pathname) === normalize(fullHref) ||
            normalize(pathname).startsWith(normalize(fullHref) + "/");

          return (
            <Link
              key={fullHref}
              href={fullHref}
              className={`flex items-center gap-2 py-2 px-4 rounded transition
                ${isActive
                  ? "bg-gray-600 text-white font-semibold"
                  : "text-gray-900 hover:bg-gray-200"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-2 mt-4 bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
      >
        <LogOut className="w-5 h-5" /> Log Out
      </button>
    </div>
  );
}
