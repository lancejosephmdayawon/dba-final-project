'use client';

import AppointmentForm from "@/components/AppointmentForm";
import UpcomingAppointments from "@/components/UpcomingAppointments";
import { useSession } from "next-auth/react";

export default function Appointment() {
  const { data: session } = useSession();

  if (!session) return <p>Please log in to view or book appointments.</p>;

  return (
    <div className="space-y-8">
      <section>
        <UpcomingAppointments />
      </section>

      <section>
        <AppointmentForm />
      </section>
    </div>
  );
}
