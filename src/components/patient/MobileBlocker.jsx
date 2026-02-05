"use client"; // must be client-side to access window

import Image from "next/image";
import { useEffect, useState } from "react";

export default function MobileBlocker() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsMobileOrTablet(width < 1024); // mobile/tablet breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!isMobileOrTablet) return null; // desktop/laptop users proceed normally

  // Mobile/tablet users see this full-screen message
return (
  <div
    className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-6
    bg-[linear-gradient(rgba(59,130,246,0.6),rgba(59,130,246,0.6)),url('/images/login-bg.jpg')]
    bg-cover bg-center"
  >
    
      <Image
        src="/images/logo.png"
        alt="App Logo"
        width={100}
        height={100}
        className=" mx-auto"
      />

      <h1 className="text-2xl font-bold mb-2 text-white">
        Get Our App Now!
      </h1>

      <p className="text-sm mb-4 text-white">
        This website is designed for desktop and laptop devices only.
      </p>

      <a
        href="#"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
      >
        Download App
      </a>
    </div>

);

}
