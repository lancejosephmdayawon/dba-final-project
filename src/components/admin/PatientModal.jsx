// Path: src/app/admin/patients/PatientModal.jsx
"use client";

import { useState } from "react";
import {
  LucideCheck,
  LucideX,
  LucideEdit,
} from "lucide-react";

export default function PatientModal({ patient, onClose, onUpdated }) {
  const [viewMode, setViewMode] = useState(true);
  const [form, setForm] = useState({ ...patient });

  // Save updates
  const save = async () => {
    await fetch(`/api/admin/patients/${patient.user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setViewMode(true);
    onUpdated();
  };

  // Toggle verification
  const toggleVerify = async () => {
    await fetch(`/api/admin/patients/${patient.user_id}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !form.email_verified }),
    });
    onUpdated();
  };

  // Format birthdate for display
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Patient {viewMode ? "Details" : "Edit"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <LucideX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        {viewMode ? (
          <div className="space-y-2 text-gray-700">
            <p><span className="font-semibold">Name:</span> {form.first_name || ""} {form.last_name || ""}</p>
            <p><span className="font-semibold">Email:</span> {form.email || ""}</p>
            <p><span className="font-semibold">Contact:</span> {form.contact_number || "-"}</p>
            <p><span className="font-semibold">Gender:</span> {form.gender || "-"}</p>
            <p><span className="font-semibold">Birthday:</span> {formatDate(form.birthdate)}</p>
            <p><span className="font-semibold">Age:</span> {form.age || "-"}</p>
            <p><span className="font-semibold">Latest Completed:</span> {form.latest_completed || "-"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-gray-700">
            {/* Edit mode inputs */}
            <input
              type="text"
              placeholder="First Name"
              value={form.first_name || ""}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none w-full transition"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.last_name || ""}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none w-full transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none col-span-2 transition"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={form.contact_number || ""}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none col-span-2 transition"
            />
            <select
              value={form.gender || ""}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none col-span-2 transition"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="date"
              value={form.birthdate || ""}
              onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none col-span-2 transition"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={toggleVerify}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
              form.email_verified
                ? "bg-yellow-500 hover:bg-yellow-400"
                : "bg-green-600 hover:bg-green-500"
            } transition-colors`}
          >
            {form.email_verified ? <LucideX className="w-4 h-4" /> : <LucideCheck className="w-4 h-4" />}
            {form.email_verified ? "Unverify" : "Verify"}
          </button>

          <div className="flex gap-2">
            {viewMode ? (
              <button
                onClick={() => setViewMode(false)}
                className="flex items-center gap-1 border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <LucideEdit className="w-4 h-4" /> Edit
              </button>
            ) : (
              <button
                onClick={save}
                className="flex items-center gap-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                <LucideCheck className="w-4 h-4" /> Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
