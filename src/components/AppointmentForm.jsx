"use client";

import { useState, useEffect } from "react";
import { CalendarFold, Clock, IdCardLanyard } from "lucide-react";

export default function AppointmentForm({ patientId }) {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // fetch services
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices);
  }, []);

  // fetch available times when service or date changes
  useEffect(() => {
    if (!serviceId || !date) {
      setAvailableTimes([]);
      setTime("");
      return;
    }

    fetch(`/api/appointments/available?serviceId=${serviceId}&date=${date}`)
      .then((res) => res.json())
      .then((times) => {
        setAvailableTimes(times);
        setTime("");
      })
      .catch(console.error);
  }, [serviceId, date]);

  // Auto-hide alert after 10 seconds
  useEffect(() => {
    if (!showMessage) return;

    const timer = setTimeout(() => setShowMessage(false), 10000);
    return () => clearTimeout(timer);
  }, [showMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!availableTimes.includes(time)) {
      setMessage("Selected time is no longer available.");
      setShowMessage(true);
      return;
    }

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, serviceId, date, time, notes }),
    });

    const data = await res.json();
    setMessage(data.message);
    setShowMessage(true);

    if (res.ok) {
      setServiceId("");
      setDate("");
      setTime("");
      setNotes("");
      setAvailableTimes([]);
    }
  };

  return (
    <div className="m-6 flex justify-center px-6">
      <div className="w-full rounded-2xl bg-blue-100 p-6 shadow-lg">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-extrabold text-gray-800">
            Book New Appointment
          </h2>
          <p className="text-gray-600 text-base">
            Request an appointment with our dentist
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Service Dropdown */}
          <div>
            <label className="flex items-center gap-1 font-semibold mb-1">
              <IdCardLanyard size={18} /> Appointment Type
            </label>
            <select
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setTime("");
                setAvailableTimes([]);
              }}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select type</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration_minutes} mins)
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="flex items-center gap-1 font-semibold mb-1">
              <CalendarFold size={18} /> Preferred Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                const selectedDate = e.target.value;
                setDate(selectedDate);

                if (!selectedDate) {
                  setTime("");
                  setAvailableTimes([]);
                }
              }}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="flex items-center gap-1 font-semibold mb-1">
              <Clock size={18} /> Preferred Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              list="available-times"
              className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !date ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
              disabled={!date}
              required={!!date}
            />
            <datalist id="available-times">
              {availableTimes.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            {date && availableTimes.length === 0 && (
              <div className="mt-2 text-xs text-gray-500">
                No available slots for this date
              </div>
            )}
            {availableTimes.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Available: {availableTimes.join(", ")}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1 font-semibold mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              placeholder="Any special requirements or concerns..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-30 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Dismissible Alert */}
          {showMessage && (
            <div className="mb-5 flex justify-between items-center rounded-lg bg-blue-200 p-2 text-blue-700 transition-opacity duration-500">
              <span>{message}</span>
              <button
                onClick={() => setShowMessage(false)}
                className="ml-4 text-blue-700 hover:text-blue-900"
              >
                ✖
              </button>
            </div>
          )}

          {/* Submit Button */}
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
