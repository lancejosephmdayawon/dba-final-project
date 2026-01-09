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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 text-center p-6">
      <Image src="/images/logo.png" alt="App Logo" width={100} height={100} className="mb-6" />
      <h1 className="text-3xl font-bold mb-2">Get Our App Now!</h1>
      <p className="text-lg mb-4">This website is designed for desktop and laptop devices only.</p>
      <a
        href="#"
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
      >
        Download App
      </a>
    </div>
  );
}
