'use client';

import ChangePasswordCard from "@/components/patient/ChangePasswordCard";
import EditProfileCard from "@/components/patient/EditProfileCard";
import { useSession } from "next-auth/react";

export default function Appointment() {
  const { data: session } = useSession();

  if (!session) return <p>Please log in to change settings.</p>;

  return (
    <div className="space-y-8">
      <section>
        <EditProfileCard />
      </section>
      <section>
        <ChangePasswordCard />
      </section>
    </div>
  );
}