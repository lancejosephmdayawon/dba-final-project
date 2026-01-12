"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Pencil,
  Save,
  Lock,
} from "lucide-react";

export default function SettingsCard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
  const [message, setMessage] = useState("");

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

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user & patient data
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

  const initial = session?.user?.username?.charAt(0).toUpperCase() || "?";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (
      showPasswordFields &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setMessage("New passwords do not match");
      return;
    }

    if (showPasswordFields) {
      setShowPasswordConfirmModal(true);
      return;
    }

    await updateProfile();
  };

  const updateProfile = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...(showPasswordFields ? passwordData : {}),
        }),
      });
      const result = await res.json();
      setMessage(result.message || "Profile updated!");
      setIsEditing(false);
      setShowPasswordFields(false);
      setShowPasswordConfirmModal(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-blue-100/70 border border-blue-200 rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
            {initial}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {formData.first_name || ""} {formData.last_name || ""}
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Edit Profile Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-300 rounded-lg"
          >
            <Pencil size={16} />
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>

          {/* Change Password Button */}
          <button
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-300 rounded-lg"
          >
            <Lock size={16} />
            {showPasswordFields ? "Cancel Password" : "Change Password"}
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField
          label="First Name"
          name="first_name"
          value={formData.first_name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          icon={User}
        />
        <InfoField
          label="Middle Name"
          name="middle_name"
          value={formData.middle_name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          icon={User}
        />
        <InfoField
          label="Last Name"
          name="last_name"
          value={formData.last_name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          icon={User}
        />
        <InfoField
          label="Email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          disabled={!isEditing}
          icon={Mail}
        />
        <InfoField
          label="Contact Number"
          name="contact_number"
          value={formData.contact_number || ""}
          onChange={handleChange}
          disabled={!isEditing}
          icon={Phone}
        />
        <InfoField
          label="Address"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          disabled={!isEditing}
          icon={MapPin}
        />
        <InfoField
          label="Birthdate"
          name="birthdate"
          type="date"
          value={formData.birthdate || ""}
          onChange={handleChange}
          disabled={!isEditing}
          icon={Calendar}
        />
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users size={16} /> Gender
          </label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Password Fields */}
      {showPasswordFields && (
        <div className="mt-6 border-t border-blue-200 pt-6">
          <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Lock size={18} /> Update Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PasswordField
              label="Old Password"
              name="oldPassword"
              value={passwordData.oldPassword || ""}
              onChange={handlePasswordChange}
            />
            <PasswordField
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword || ""}
              onChange={handlePasswordChange}
            />
            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordData.confirmPassword || ""}
              onChange={handlePasswordChange}
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      {isEditing && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      )}

      {/* Confirmation Modal for Password */}
      {showPasswordConfirmModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h4 className="font-semibold text-gray-800 mb-2">
              Confirm Password Change
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to update your password?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordConfirmModal(false)}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={() => updateProfile()}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
    </div>
  );
}

/* ---------- Reusable Components ---------- */

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

function PasswordField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type="password"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
