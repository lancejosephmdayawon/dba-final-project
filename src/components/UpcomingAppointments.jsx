'use client';

import { useState, useEffect } from "react";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // default tab is "All"

  // Fetch appointments from API
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

  // Cancel an appointment
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

  // Badge color by status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-gray-300 text-gray-800";
      case "approved": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Tab order
  const statuses = ["all", "pending", "approved", "completed", "cancelled"];

  // Group appointments by status for convenience
  const grouped = appointments.reduce((acc, appt) => {
    if (!acc[appt.status]) acc[appt.status] = [];
    acc[appt.status].push(appt);
    return acc;
  }, {});

  if (loading) return <p>Loading appointments...</p>;

  // Reusable appointment card
  const AppointmentCard = ({ appt }) => (
    <div className="p-4 border rounded-lg flex justify-between items-center bg-gray-50 shadow-sm">
      <div>
        <p className="font-semibold">{appt.service_name}</p>
        <p>
          Status:{" "}
          <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(appt.status)}`}>
            {appt.status}
          </span>
        </p>
        <p>Date: {appt.appointment_date} | Time: {appt.start_time}</p>
      </div>

      <div>
        {appt.status !== "cancelled" && appt.status !== "completed" && (
          <>
            <button
              onClick={() => setConfirmCancelId(appt.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Cancel
            </button>

            {confirmCancelId === appt.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded shadow-lg space-y-4">
                  <p>Are you sure you want to cancel this appointment?</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setConfirmCancelId(null)}
                      className="px-3 py-1 border rounded"
                    >
                      No
                    </button>
                    <button
                      onClick={() => cancelAppointment(appt.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Yes, Cancel
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

  return (
    <div className="max-w-3xl mx-auto my-6 p-6 bg-white rounded-xl shadow-md">
      {/* Alert toast */}
      {alertMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
          {alertMessage}
        </div>
      )}

      <h3 className="text-lg font-bold mb-4">Upcoming Appointments</h3>

      {/* Tabs */}
      <div className="flex border-b mb-4 overflow-x-auto">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 -mb-px font-medium border-b-2 ${
              activeTab === status
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {status === "all"
              ? "All"
              : status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && grouped[status] ? ` (${grouped[status].length})` : ""}
          </button>
        ))}
      </div>

      {/* Appointment list for active tab */}
      <div className="space-y-4">
        {(activeTab === "all"
          ? appointments
          : grouped[activeTab] || []
        ).map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} />
        ))}

        {(activeTab === "all" && appointments.length === 0) ||
        (activeTab !== "all" && (!grouped[activeTab] || grouped[activeTab].length === 0)) ? (
          <p className="text-gray-500">No {activeTab === "all" ? "" : activeTab} appointments.</p>
        ) : null}
      </div>
    </div>
  );
}
