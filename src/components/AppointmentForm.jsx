"use client";

import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function AppointmentForm({ patientId }) {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState("");

  // fetch services
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices);
  }, []);

  // fetch available times when service or date changes
  useEffect(() => {
    if (!serviceId || !date) return;

    fetch(`/api/appointments/available?serviceId=${serviceId}&date=${date}`)
      .then((res) => res.json())
      .then(setAvailableTimes);
  }, [serviceId, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, serviceId, date, time, notes }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      setServiceId("");
      setDate("");
      setTime("");
      setNotes("");
    }
  };

  return (
    <div className="m-6 flex justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Book Appointment
        </h2>

        {message && (
          <div className="mb-4 rounded-lg bg-red-100 p-2 text-red-700">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Service Dropdown */}
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.duration_minutes} mins)
              </option>
            ))}
          </select>
          {/* Date Picker */}
          <input
            type="date"
            value={date}
            onChange={(e) => {
              const selectedDate = e.target.value;
              setDate(selectedDate);

              // Clear time and available times if date is empty
              if (!selectedDate) {
                setTime("");
                setAvailableTimes([]);
              }
            }}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Time Picker */}
          <div className="mt-3">
            <label className="flex items-center gap-1 text-blue-900 font-medium mb-1">
              <Clock size={18} /> Time
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              list="available-times"
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!!date} // required only if date is selected
            />

            <datalist id="available-times">
              {availableTimes.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>

            {availableTimes.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Available: {availableTimes.join(", ")}
              </div>
            )}
          </div>
          {/* Notes */}
          <textarea
            placeholder="Additional notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
