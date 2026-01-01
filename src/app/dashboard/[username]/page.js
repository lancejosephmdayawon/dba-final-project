import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/nextauth";
import { redirect } from "next/navigation";
import LogoutButton from "@components/LogoutButton";

export default async function DashboardPage({ params }) {
  // Get session server-side
  const session = await getServerSession(authOptions);


  // Redirect if no session
  if (!session) {
    redirect("/login");
  }

  // Access params correctly — NO await
  const { username } = await params;

  // Redirect if URL username does not match session
  if (username !== session.user.username) {
    redirect(`/dashboard/${session.user.username}`);
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <h1 className="text-2xl font-bold mb-2">Dashboard Test</h1>
        <p className="text-lg">
          Username: <span className="font-semibold">{session.user.username}</span>
        </p>
        <p className="text-lg">
          Email: <span className="font-semibold">{session.user.email}</span>
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
