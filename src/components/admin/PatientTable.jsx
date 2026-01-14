// Path: src/app/admin/patients/PatientTable.jsx
"use client";

import { LucideCheckCircle, LucideXCircle } from "lucide-react";

export default function PatientTable({ patients, loading, onSelect }) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center">
        Loading...
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center">
        No patients found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm rounded-xl shadow bg-white">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th>Email</th>
            <th>Status</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.user_id} className="border-b hover:bg-gray-50 cursor-pointer">
              <td className="p-3">{p.first_name} {p.last_name}</td>
              <td>{p.email}</td>
              <td className="flex justify-center">
                {p.email_verified ? (
                  <LucideCheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <LucideXCircle className="w-5 h-5 text-yellow-600" />
                )}
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => onSelect(p)}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
