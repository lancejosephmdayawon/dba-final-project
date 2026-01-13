"use client";

import { useEffect, useState } from "react";
import { CreditCard, Calendar, Clock, CheckCircle, XCircle, Info } from "lucide-react";

export default function AdminPaymentsDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const res = await fetch("/api/admin/transactions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(paymentId, status) {
    await fetch(`/api/admin/transactions/${paymentId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setTransactions((txs) =>
      txs.map((tx) =>
        tx.payment_id === paymentId
          ? { ...tx, payment_status: status, paid_at: status === "paid" ? new Date() : null }
          : tx
      )
    );
  }

  const filteredTransactions =
    filter === "all" ? transactions : transactions.filter((tx) => tx.payment_status === filter);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    const [h, m] = timeStr.split(":");
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="mx-6 my-6 space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "paid"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${filter === status ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-blue-50"}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {loading ? (
        <p className="p-6 text-gray-500">Loading transactions...</p>
      ) : filteredTransactions.length === 0 ? (
        <p className="p-6 text-gray-500">No transactions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.payment_id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              {/* Top Info */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {tx.last_name}, {tx.first_name} {tx.middle_name || ""}
                  </p>
                  <p className="text-xs text-gray-400">{tx.contact_number}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${tx.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {tx.payment_status}
                </span>
              </div>

              {/* Service & Appointment */}
              <div className="flex items-center gap-4 text-gray-600 text-sm mb-2">
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-blue-400" /> {tx.payment_method || "—"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-400" /> {formatDate(tx.appointment_date)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-400" /> {formatTime(tx.start_time)}
                </div>
              </div>

              {/* Service name and amount */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-800 font-medium">{tx.service_name}</p>
                <p className="font-semibold text-gray-900">₱{Number(tx.amount).toFixed(2)}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() =>
                    tx.payment_status === "paid"
                      ? updateStatus(tx.payment_id, "pending")
                      : updateStatus(tx.payment_id, "paid")
                  }
                  className={`flex items-center gap-1 text-sm font-medium transition ${
                    tx.payment_status === "paid"
                      ? "text-yellow-600 hover:underline"
                      : "text-green-600 hover:underline"
                  }`}
                >
                  {tx.payment_status === "paid" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                  {tx.payment_status === "paid" ? "Mark Pending" : "Mark Paid"}
                </button>

                <button
                  onClick={() => alert(`Appointment Notes:\n\n${tx.notes || "No notes."}`)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:underline"
                >
                  <Info size={16} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
