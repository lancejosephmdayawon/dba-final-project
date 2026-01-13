"use client";

import AdminPaymentsDashboard from "@/components/admin/AdminPaymentsDashboard";
import { useSession } from "next-auth/react";

export default function Appointment() {
  const { data: session } = useSession();

  if (!session) return <p>Please <a href="/login" className ='underline text-blue-700'>log in</a> to view transactions.</p>;

  return (
    <>
      <AdminPaymentsDashboard />
    </>
  );
}
