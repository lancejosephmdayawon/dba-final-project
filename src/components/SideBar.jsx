"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Calendar, CreditCard, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Wait until session is loaded
  if (status === "loading") return null;
  if (!session) return null; // optionally redirect to login

  // Use username from session; fallback to name if username not set
  const username = session.user.username || session.user.name;

  const navItems = [
    { label: "My Appointments", href: "appointments", icon: Calendar },
    { label: "Payment", href: "payment", icon: CreditCard },
    { label: "Settings", href: "settings", icon: Settings },
  ];

  // Helper to normalize paths (remove trailing slash)
  const normalize = (url) => url.replace(/\/$/, "");

  return (
    <div className="w-64 bg-gradient-to-b from-blue-100 to-blue-300 h-screen p-4 flex flex-col">
      
      {/* Logo and Title */}
      <div className="flex justify-center h-32">
        <div className="flex items-center">
          <img src="/images/logo.png" alt="Logo" className="w-20 h-20 mr-2" />
          <div className="flex flex-col">
            <img src="/images/logoName.png" alt="Title" className="w-30 h-auto" />
            <span className="text-sm text-gray-700">Patient Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const fullHref = `/dashboard/${username}/${href}`;
          const isActive =
            normalize(pathname) === normalize(fullHref) ||
            normalize(pathname).startsWith(normalize(fullHref) + "/");

          return (
            <Link
              key={fullHref}
              href={fullHref}
              className={`flex items-center gap-2 py-2 px-4 rounded transition
                ${isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-900 hover:bg-blue-200"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-2 mt-4 bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
      >
        <LogOut className="w-5 h-5" /> Log Out
      </button>
    </div>
  );
}
