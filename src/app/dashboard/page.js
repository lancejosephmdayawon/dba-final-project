// src/app/dashboard/page.js
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/nextauth";

export default async function DashboardRoot() {
  // Get the session server-side
  const session = await getServerSession(authOptions);

  if (session) {
    // If the user is logged in, redirect to their personal dashboard
    redirect(`/dashboard/${session.user.username}`);
  } else {
    // Not logged in → redirect to login page
    redirect("/login");
  }

  // This line is never reached, redirect handles it
}
