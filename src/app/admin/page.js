import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/nextauth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Not logged in → redirect
  if (!session) return redirect("/login");

  // Logged in but not admin → redirect
  if (session.user.role !== "admin")
    return redirect(`/dashboard/${session.user.username}/appointments`)
  {
    return redirect(`admin/appointments`);
  };

  // Admin only → always return JSX
  // return (
  //   <div className="space-y-8">
  //     <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
  //     <p className="text-white">Welcome, {session.user.name}</p>
  //   </div>
  // );
}
