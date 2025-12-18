"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-sm text-gray-500">
          Not logged in. Redirecting to login page...
        </p>
      </div>
    );
  }

  return null;
}
