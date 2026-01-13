// src/app/dashboard/page.js
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/nextauth";

export default async function DashboardRoot() {
  const session = await getServerSession(authOptions);

  // Not logged in → login page
  if (!session) {
    redirect("/login");
  }

  // Admin → admin dashboard
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  // All other users → personal dashboard
  redirect(`/dashboard/${session.user.username}/appointments`);
}
