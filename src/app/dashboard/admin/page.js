import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/nextauth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Not logged in → login
  if (!session) {
    redirect("/login");
  }

  // Logged in but NOT admin → personal dashboard
  if (session.user.role !== "admin") {
    redirect(`/dashboard/${session.user.username}/appointments`);
  }

  // Admin only
  return (
    <div className="space-y-8">
      hi
    </div>
  );
}
