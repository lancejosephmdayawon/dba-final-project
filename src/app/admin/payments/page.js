"use client";

import AdminPaymentsDashboard from "@/components/admin/AdminPaymentsDashboard";
import AdminSummaryCards from "@/components/admin/AdminSummaryCards";
import { useSession } from "next-auth/react";

export default function Appointment() {
  const { data: session } = useSession();

  if (!session)
    return (
      <p>
        Please{" "}
        <a href="/login" className="underline text-blue-700">
          log in
        </a>{" "}
        to view transactions.
      </p>
    );

  return (
    <div>
      <section>
        <AdminSummaryCards />
      </section>
      <section>
        <AdminPaymentsDashboard />
      </section>
    </div>
  );
}
