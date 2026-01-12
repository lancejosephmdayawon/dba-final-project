'use client';
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CheckSession() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("Session object:", session);
    if (session) console.log("Session user ID:", session.user.id);
  }, [session]);

  return <p>Open console to see session info</p>;
}
