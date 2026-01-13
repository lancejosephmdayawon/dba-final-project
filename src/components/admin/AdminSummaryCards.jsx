"use client";

import { useEffect, useState } from "react";
import { CreditCard, Clock, CheckCircle } from "lucide-react";

export default function AdminSummaryCards() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    try {
      const res = await fetch("/api/admin/transactions/summary", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-6">
      {/* Total Transactions */}
      <SummaryCard
        title="Total Transactions"
        value={summary.totalTransactions}
        icon={CreditCard}
        color="text-blue-600"
      />

      {/* Pending Balance */}
      <SummaryCard
        title="Pending Balance"
        value={`₱${Number(summary.pendingBalance || 0).toFixed(2)}`}
        icon={Clock}
        color="text-yellow-600"
      />

      {/* Collected Amount */}
      <SummaryCard
        title="Collected Amount"
        value={`₱${Number(summary.collectedAmount || 0).toFixed(2)}`}
        icon={CheckCircle}
        color="text-green-600"
      />
    </div>
  );
}

// Reusable Summary Card Component

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">
          {value}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 ${color}`}
      >
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
