"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, MapPin, Calendar, Users, Pencil, Save } from "lucide-react";

export default function EditProfileCard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profileEditing, setProfileEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    address: "",
    birthdate: "",
    gender: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!session) return;
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setFormData({
          first_name: data.user.first_name || "",
          middle_name: data.user.middle_name || "",
          last_name: data.user.last_name || "",
          email: data.user.email || "",
          contact_number: data.patient.contact_number || "",
          address: data.patient.address || "",
          birthdate: data.patient.birthdate?.split("T")[0] || "",
          gender: data.patient.gender || "",
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [session]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const showTempMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 10000); // clear after 10s
  };

  const saveProfile = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      showTempMessage(result.message || "Profile updated!");
      setProfileEditing(false);
    } catch (err) {
      console.error(err);
      showTempMessage("Error updating profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-blue-100/70 border border-blue-200 rounded-2xl shadow-sm p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Pencil size={16} /> Edit Profile
        </h3>
        <button
          onClick={() => setProfileEditing(!profileEditing)}
          className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-300 rounded-lg"
        >
          {profileEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} disabled={!profileEditing} icon={User} />
        <InfoField label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} disabled={!profileEditing} icon={User} />
        <InfoField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} disabled={!profileEditing} icon={User} />
        <InfoField label="Email" name="email" value={formData.email} onChange={handleChange} disabled={!profileEditing} icon={Mail} />
        <InfoField label="Contact Number" name="contact_number" value={formData.contact_number} onChange={handleChange} disabled={!profileEditing} icon={Phone} />
        <InfoField label="Address" name="address" value={formData.address} onChange={handleChange} disabled={!profileEditing} icon={MapPin} />
        <InfoField label="Birthdate" name="birthdate" value={formData.birthdate} onChange={handleChange} disabled={!profileEditing} type="date" icon={Calendar} />
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users size={16} /> Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!profileEditing}
            className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {profileEditing && (
        <div className="flex justify-end mt-4">
          <button
            onClick={saveProfile}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            <Save size={16} /> Save Profile
          </button>
        </div>
      )}

      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
    </div>
  );
}

function InfoField({ label, name, value, onChange, disabled, type = "text", icon: Icon }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
        <Icon size={16} /> {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
      />
    </div>
  );
}
