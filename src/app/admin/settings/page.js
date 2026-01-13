'use client';

import AdminChangePasswordCard from "@/components/admin/AdminChangePasswordCard";
import { useSession } from "next-auth/react";

export default function AdminSettings() {
  const { data: session } = useSession();

  if (!session) return <p>Please <a href="/login" className ='underline text-blue-700'>log in</a> to change settings.</p>;

  return (
    <div className="space-y-8">
      <section>
        <AdminChangePasswordCard />
      </section>
    </div>
  );
}