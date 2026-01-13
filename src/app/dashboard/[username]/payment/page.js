"use client";

import PaymentOptionsCard from "@/components/patient/PaymentOptionsCard";
import SummaryCards from "@/components/patient/SummaryCards";
import TransactionsCard from "@/components/patient/TransactionCard";
import { useSession } from "next-auth/react";

export default function Appointment() {
  const { data: session } = useSession();

  if (!session) return <p>Please <a href="/login" className ='underline text-blue-700'>log in</a> to view transactions.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mx-6 mt-6">Payment History & Transparency</h2>
        <p className="mx-6 text-gray-700">View all your payment transactions and balances.</p>
      </div>
      <section>
        <SummaryCards />
      </section>
      <section>
        <TransactionsCard />
      </section>
      <section>
        <PaymentOptionsCard />
      </section>
    </div>
  );
}
