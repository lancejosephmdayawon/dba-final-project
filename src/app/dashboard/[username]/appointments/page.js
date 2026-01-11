'use client';
import AppointmentForm from "@/components/AppointmentForm";
import { useSession } from "next-auth/react";

export default function Appointment() {
  const { data: session } = useSession();

  // if not logged in, you can show a message or redirect
  if (!session) return <p>Please log in to book an appointment.</p>;

  // assume session.user.id is the patient_id
  return <AppointmentForm patientId={session.user.id} />;
}
