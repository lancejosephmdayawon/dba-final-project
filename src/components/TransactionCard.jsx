"use client";

import { useEffect, useState } from "react";
import { Receipt, CreditCard, Calendar, Clock } from "lucide-react";

export default function TransactionCard() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const res = await fetch("/api/transactions", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.payment_status === filter);

  /* ---------- Native JS formatters ---------- */
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(":");
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-6 my-6 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-blue-100">
        <Receipt className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-6 py-4">
        {["all", "pending", "paid"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${
                filter === status
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:bg-blue-50"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-400 border-b">
              <th className="px-4 py-3 text-center">No.</th>
              <th className="px-6 py-3 text-left">Service</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Date Paid</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {(loading
              ? [{ __type: "loading" }]
              : filteredTransactions.length === 0
              ? [{ __type: "empty" }]
              : filteredTransactions
            ).map((tx, index) => {
              if (tx.__type === "loading") {
                return (
                  <tr key="loading-row">
                    <td
                      colSpan="8"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      Loading transactions...
                    </td>
                  </tr>
                );
              }

              if (tx.__type === "empty") {
                return (
                  <tr key="empty-row">
                    <td
                      colSpan="8"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No transactions found
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={tx.id ?? `tx-${index}`} // fallback if id is missing
                  className="border-t hover:bg-blue-50/50 transition"
                >
                  {/* No. */}
                  <td className="px-4 py-4 text-center text-gray-500">
                    {index + 1}
                  </td>

                  {/* Service */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {tx.service_name}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      {formatDate(tx.appointment_date)}
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {formatTime(tx.start_time)}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-right font-medium text-gray-800">
                    ₱{Number(tx.amount || 0).toFixed(2)}
                  </td>

                  {/* Payment Method */}
                  <td className="px-6 py-4 text-gray-600 capitalize">
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      {tx.payment_method || "—"}
                    </div>
                  </td>

                  {/* Date Paid */}
                  <td className="px-6 py-4 text-gray-500">
                    {tx.paid_at ? formatDate(tx.paid_at) : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          tx.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {tx.payment_status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
