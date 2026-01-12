import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/nextauth";
import { redirect } from "next/navigation";


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
    redirect(`/dashboard/${session.user.username}/appointments`);
  } else {
    redirect(`/dashboard/${username}/appointments`);
  }

  
  // return (
  //     <div className="flex-1 bg-gray-100 p-6">
  //       <h1 className="text-3xl font-bold mb-4">Main Content</h1>
  //       <p>This is where your main page content goes.</p>
  //     </div>
  // );
}
