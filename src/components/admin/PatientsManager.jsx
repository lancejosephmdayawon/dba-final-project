// Path: src/app/admin/patients/PatientsManager.jsx
"use client";

import { useEffect, useState } from "react";
import { LucideSearch, LucideUserPlus } from "lucide-react";
import PatientTable from "./PatientTable";
import PatientModal from "./PatientModal";
import AddPatientModal from "./AddPatientModal";

export default function PatientsManager() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  const fetchPatients = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/patients");
    const data = await res.json();
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => {
    const name = `${p.first_name} ${p.last_name}`.toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());

    const matchesVerified =
      verifiedFilter === "all"
        ? true
        : verifiedFilter === "verified"
        ? p.email_verified
        : !p.email_verified;

    return matchesSearch && matchesVerified;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Patient Management</h1>

      {/* CONTROL BAR */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-64">
          <LucideSearch className="w-5 h-5 text-gray-400 mr-2" />
          <input
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="outline-none w-full text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        <select
          value={verifiedFilter}
          onChange={e => setVerifiedFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>

        <button
          onClick={() => setShowAddModal(true)}
          className="ml-auto flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <LucideUserPlus className="w-5 h-5" /> Add Patient
        </button>
      </div>

      <PatientTable
        patients={filteredPatients}
        loading={loading}
        onSelect={setSelectedPatient}
      />

      {selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdated={() => {
            setSelectedPatient(null);
            fetchPatients();
          }}
        />
      )}

      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            fetchPatients();
          }}
        />
      )}
    </div>
  );
}
