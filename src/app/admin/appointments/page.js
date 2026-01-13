'use client';

import AdminAppointments from "@/components/admin/AdminAppointments";
import { useSession } from "next-auth/react";

export default function AdminAppointment() {
  const { data: session } = useSession();

  if (!session) return <p>Please <a href="/login" className ='underline text-blue-700'>log in</a> to view or book appointments.</p>;

  return (
    <div className="space-y-8">
      <section>
        <AdminAppointments />
      </section>
    </div>
  );
}
