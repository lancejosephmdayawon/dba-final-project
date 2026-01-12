'use client';

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, Loader2, Hourglass, Check, CalendarCheck, XOctagon } from "lucide-react";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // --- Fetch appointments ---
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments/upcoming");
      const text = await res.text();
      const data = text ? JSON.parse(text) : { appointments: [] };
      setAppointments(data?.appointments || []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // --- Cancel appointment ---
  const cancelAppointment = async (id) => {
    try {
      const res = await fetch("/api/appointments/upcoming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id }),
      });

      if (!res.ok) throw new Error("Failed to cancel");

      setAlertMessage("Appointment cancelled successfully!");
      setConfirmCancelId(null);
      fetchAppointments();

      setTimeout(() => setAlertMessage(""), 5000);
    } catch (err) {
      console.error(err);
      setAlertMessage("Failed to cancel appointment");
      setTimeout(() => setAlertMessage(""), 5000);
    }
  };

  // --- Helpers ---
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-700";
      case "approved": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  };

  // --- Tabs ---
  const statuses = ["all", "pending", "approved", "completed", "cancelled"];
  const grouped = appointments.reduce((acc, appt) => {
    if (!acc[appt.status]) acc[appt.status] = [];
    acc[appt.status].push(appt);
    return acc;
  }, {});

  // --- Appointment card ---
  const AppointmentCard = ({ appt }) => (
    <div className="p-4 rounded-xl shadow hover:shadow-lg transition-shadow bg-white flex justify-between items-center space-x-4">
      <div className="flex-1 space-y-1">
        <p className="font-semibold flex items-center gap-2 text-gray-900">
          <CheckCircle className="text-blue-500" size={18} /> {appt.service_name}
        </p>
        <p className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(appt.status)}`}>
            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
          </span>
        </p>
        <p className="flex items-center gap-2 text-gray-600">
          <Calendar className="text-gray-400" size={16} /> {formatDate(appt.appointment_date)}
        </p>
        <p className="flex items-center gap-2 text-gray-600">
          <Clock className="text-gray-400" size={16} /> {formatTime(appt.start_time)}
        </p>
      </div>

      <div className="flex-shrink-0">
        {appt.status !== "cancelled" && appt.status !== "completed" && (
          <>
            <button
              onClick={() => setConfirmCancelId(appt.id)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              <XCircle size={16} /> Cancel
            </button>

            {confirmCancelId === appt.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-sm w-full">
                  <p>Are you sure you want to cancel this appointment?</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setConfirmCancelId(null)}
                      className="px-3 py-1 border rounded-full hover:bg-gray-100 transition"
                    >
                      No
                    </button>
                    <button
                      onClick={() => cancelAppointment(appt.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-full flex items-center gap-1 hover:bg-red-600 transition"
                    >
                      <XCircle size={16} /> Yes, Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // --- Summary cards config ---
  const summaryConfigs = [
    { title: "Pending", status: "pending", color: "bg-gray-100", textColor: "text-gray-700", icon: <Hourglass size={24} /> },
    { title: "Approved", status: "approved", color: "bg-green-100", textColor: "text-green-800", icon: <Check size={24} /> },
    { title: "Completed", status: "completed", color: "bg-blue-100", textColor: "text-blue-800", icon: <CalendarCheck size={24} /> },
    { title: "Cancelled", status: "cancelled", color: "bg-red-100", textColor: "text-red-800", icon: <XOctagon size={24} /> },
  ];

  return (
    <div className="m-6 justify-center px-6 space-y-6">
      {/* Alert toast */}
      {alertMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow z-50">
          {alertMessage}
        </div>
      )}

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {summaryConfigs.map((cfg) => (
          <div
            key={cfg.status}
            className={`flex items-center gap-4 p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer ${cfg.color}`}
          >
            <div className={`p-2 rounded-full ${cfg.textColor} bg-white`}>
              {cfg.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{cfg.title}</p>
              <p className={`text-xl font-bold ${cfg.textColor}`}>
                {grouped[cfg.status]?.length || 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Main Upcoming Appointments Card --- */}
      <div className="bg-blue-100 rounded-2xl shadow-lg p-6 space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          Your Appointments
        </h3>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", ...statuses.slice(1)].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === status
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {loading ? (
          <p className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" /> Loading appointments...
          </p>
        ) : (
          <div className="space-y-4">
            {(activeTab === "all" ? appointments : grouped[activeTab] || []).map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} />
            ))}

            {(activeTab === "all" && appointments.length === 0) ||
            (activeTab !== "all" && (!grouped[activeTab] || grouped[activeTab].length === 0)) ? (
              <p className="text-gray-500">No {activeTab === "all" ? "" : activeTab} appointments.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
