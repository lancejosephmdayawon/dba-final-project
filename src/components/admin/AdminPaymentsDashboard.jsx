"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Search, X } from "lucide-react";

export default function AdminPaymentsDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc"); // newest first
  const [modalTx, setModalTx] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/transactions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateTransaction(id, updates) {
    try {
      const res = await fetch(`/api/admin/transactions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update transaction");
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  }

  const months = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from(
    new Set(transactions.map(tx => new Date(tx.appointment_date).getFullYear()))
  ).sort((a, b) => b - a);

  const filteredTransactions = transactions
    .filter((tx) => {
      const fullName = `${tx.patient_first_name} ${tx.patient_middle_name || ""} ${tx.patient_last_name}`.toLowerCase();
      const serviceName = tx.service_name.toLowerCase();
      const query = searchQuery.toLowerCase();
      if (!fullName.includes(query) && !serviceName.includes(query)) return false;

      const txDate = new Date(tx.appointment_date);
      if (filterMonth && txDate.getMonth() + 1 !== Number(filterMonth)) return false;
      if (filterYear && txDate.getFullYear() !== Number(filterYear)) return false;
      if (filterStatus !== "all" && tx.payment_status !== filterStatus) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortField) {
        case "date":
          return sortOrder === "asc"
            ? new Date(a.appointment_date) - new Date(b.appointment_date)
            : new Date(b.appointment_date) - new Date(a.appointment_date);
        case "patient":
          const nameA = `${a.patient_first_name} ${a.patient_middle_name || ""} ${a.patient_last_name}`;
          const nameB = `${b.patient_first_name} ${b.patient_middle_name || ""} ${b.patient_last_name}`;
          return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        case "amount":
          return sortOrder === "asc"
            ? (Number(a.amount) || 0) - (Number(b.amount) || 0)
            : (Number(b.amount) || 0) - (Number(a.amount) || 0);
        default:
          return 0;
      }
    });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
  };

  const paymentMethods = ["cash", "gcash", "card", "other"];

  return (
    <div className="m-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 border rounded-full px-3 py-2 shadow-sm w-full sm:w-auto">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient or service..."
            className="outline-none bg-transparent w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="rounded-full px-3 py-2 border border-gray-200 shadow-sm focus:outline-none"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{i === 0 ? "All Months" : m}</option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="rounded-full px-3 py-2 border border-gray-200 shadow-sm focus:outline-none"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-full px-3 py-2 border border-gray-200 shadow-sm focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="rounded-full px-3 py-2 border border-gray-200 shadow-sm focus:outline-none"
          >
            <option value="date">Date</option>
            <option value="patient">Patient (A→Z)</option>
            <option value="amount">Amount</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 rounded-full border border-gray-200 shadow-sm"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Transactions Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center py-10">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No transactions found.</p>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.payment_id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b last:border-b-0 py-4 gap-2"
            >
              {/* Left info */}
              <div className="flex flex-col gap-1 w-full sm:w-2/5">
                <p className="text-gray-700 font-semibold">{`${tx.patient_first_name} ${tx.patient_middle_name || ""} ${tx.patient_last_name}`}</p>
                <p className="text-gray-500">{tx.service_name}</p>
                <p className="flex items-center gap-1 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 text-blue-400" /> {formatDate(tx.appointment_date)}
                </p>
                <p className="flex items-center gap-1 text-gray-500 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" /> {formatTime(tx.start_time)}
                </p>
              </div>

              {/* Right controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <p className="font-medium text-gray-800 w-full sm:w-auto text-right">
                  ₱{Number(tx.amount || 0).toFixed(2)}
                </p>

                <select
                  value={tx.payment_method || ""}
                  onChange={(e) =>
                    updateTransaction(tx.payment_id, { payment_method: e.target.value })
                  }
                  className="rounded-full px-3 py-1 border border-gray-200 focus:outline-none text-sm"
                >
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={tx.payment_status}
                  onChange={(e) =>
                    updateTransaction(tx.payment_id, { status: e.target.value })
                  }
                  className={`rounded-full px-3 py-1 focus:outline-none text-sm font-medium ${
                    statusColors[tx.payment_status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>

                <button
                  onClick={() => setModalTx(tx)}
                  className="text-blue-500 underline text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalTx && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setModalTx(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-2">Transaction Details</h2>
            <p><strong>Patient:</strong> {`${modalTx.patient_first_name} ${modalTx.patient_middle_name || ""} ${modalTx.patient_last_name}`}</p>
            <p><strong>Contact:</strong> {modalTx.contact_number}</p>
            <p><strong>Service:</strong> {modalTx.service_name}</p>
            <p><strong>Duration:</strong> {modalTx.duration_minutes} mins</p>
            <p><strong>Price:</strong> ₱{modalTx.price.toFixed(2)}</p>
            <p><strong>Appointment:</strong> {formatDate(modalTx.appointment_date)} at {formatTime(modalTx.start_time)}</p>
            <p><strong>Status:</strong> {modalTx.payment_status}</p>
            <p><strong>Payment Method:</strong> {modalTx.payment_method}</p>
            <p><strong>Notes:</strong> {modalTx.notes || "—"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
