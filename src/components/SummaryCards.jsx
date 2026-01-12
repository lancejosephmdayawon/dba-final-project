"use client";

import { useEffect, useState } from "react";
import { DollarSign, Clock, List } from "lucide-react";

export default function SummaryCards() {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    pendingPayments: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/transactions/summary", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch summary");

        const data = await res.json();
        console.log("Fetched summary:", data);

        // Ensure values are numbers
        setSummary({
          totalBalance: Number(data.totalBalance) || 0,
          pendingPayments: Number(data.pendingPayments) || 0,
          totalTransactions: Number(data.totalTransactions) || 0,
        });
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading summary...</p>;

  // Helper to format peso currency
  const formatPeso = (amount) => `₱${Number(amount).toFixed(2)}`;

  return (
    <div className="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {/* Total Balance */}
      <div className="flex items-center p-4 bg-blue-100 rounded-xl shadow-sm">
        <div className="p-3 bg-white rounded-full mr-4">
          <DollarSign className="text-blue-500 w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Balance</p>
          <p className="text-xl font-semibold">{formatPeso(summary.totalBalance)}</p>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="flex items-center p-4 bg-blue-100 rounded-xl shadow-sm">
        <div className="p-3 bg-white rounded-full mr-4">
          <Clock className="text-blue-500 w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-xl font-semibold">{summary.pendingPayments}</p>
        </div>
      </div>

      {/* Total Transactions */}
      <div className="flex items-center p-4 bg-blue-100 rounded-xl shadow-sm">
        <div className="p-3 bg-white rounded-full mr-4">
          <List className="text-blue-500 w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="text-xl font-semibold">{summary.totalTransactions}</p>
        </div>
      </div>
    </div>
  );
}
