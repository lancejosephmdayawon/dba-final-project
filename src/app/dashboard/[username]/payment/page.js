"use client";

import SummaryCards from "@/components/SummaryCards";
import TransactionsCard from "@/components/TransactionCard";
import { useSession } from "next-auth/react";

export default function Appointment() {
  const { data: session } = useSession();

  if (!session) return <p>Please log in to view transactions.</p>;

  return (
    <div className="space-y-8">
      <section>
        <SummaryCards />
      </section>
      <section>
        <TransactionsCard />
      </section>
    </div>
  );
}
