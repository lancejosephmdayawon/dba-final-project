// src/app/page.js
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/nextauth";

export default async function HomePage() {
  // Get the session server-side
  const session = await getServerSession(authOptions);

  if (!session) {
    // If no session, redirect to login
    redirect("/login");
  } else
  if (session.user.role === "admin") {
    // If admin, redirect to admin dashboard
    redirect("/admin");
  } else
  if (session) {
    // If logged in, redirect to their personal dashboard
    redirect(`/dashboard/${session.user.username}`);
  }

  // This line is never reached; redirect handles it
  return null;
}
