// src/app/dashboard/[username]/page.js
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@lib/nextauth";
import LogoutButton from "@components/LogoutButton";

export default async function UserDashboard({ params }) {
  const session = await getServerSession(authOptions);

  // If no session, redirect to login
  if (!session) redirect("/login");

  const { username } = params;

  // Ensure the URL username matches the logged-in user
  if (username !== session.user.username) {
    redirect(`/dashboard/${session.user.username}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-2xl font-bold mb-2">Dashboard Test</h1>
      <p className="text-lg">Username: <span className="font-semibold">{session.user.username}</span></p>
      <p className="text-lg">Email: <span className="font-semibold">{session.user.email}</span></p>
      <LogoutButton />
    </div>
  );
}
