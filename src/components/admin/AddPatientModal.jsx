// Path: src/app/admin/patients/AddPatientModal.jsx
"use client";

import { useState } from "react";
import { LucideCheck, LucideX } from "lucide-react";

export default function AddPatientModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    contact_number: "",
    gender: "",
    birthdate: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setMessage(null);

    // Only validate username and email
    if (!form.username || !form.email) {
      setMessage({ type: "error", text: "Username and email are required." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add patient");
      }

      const successText = data.tempPassword
        ? `Patient added! Temporary password: ${data.tempPassword}`
        : "Patient added successfully!";

      setMessage({ type: "success", text: successText });

      // Clear the form to prevent accidental resubmission
      setForm({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        contact_number: "",
        gender: "",
        birthdate: "",
      });

      if (onAdded) onAdded();

    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Add Patient</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <LucideX className="w-6 h-6" />
          </button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`p-3 rounded mb-4 text-white ${
              message.type === "success" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <input
            type="text"
            placeholder="Username *"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none w-full transition"
          />
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none col-span-2 transition"
          />
          <input
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
          />
          <input
            type="password"
            placeholder="Password (optional)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none col-span-2 transition"
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={form.contact_number}
            onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none col-span-2 transition"
          />
          <select
            value={form.gender}
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
            value={form.birthdate}
            onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none col-span-2 transition"
          />
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            <LucideCheck className="w-4 h-4" /> {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
