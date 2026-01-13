"use client";

import { useState } from "react";
import { Lock, Save, Eye, EyeOff, Trash2 } from "lucide-react"; // Trash2 for clear icon

export default function ChangePasswordCard() {
  const [editing, setEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const toggleShowPassword = (field) => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));

  const showTempMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(""), 10000); // disappear after 10s
  };

  const savePassword = async () => {
    setError(""); setMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showTempMessage(setError, "New passwords do not match");
      return;
    }

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      showTempMessage(setError, "All password fields are required");
      return;
    }

    try {
      const res = await fetch("/api/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword }),
      });
      const result = await res.json();

      if (res.ok) {
        showTempMessage(setMessage, result.message || "Password updated!");
        setEditing(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setShowPassword({ oldPassword: false, newPassword: false, confirmPassword: false });
      } else {
        showTempMessage(setError, result.error || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      showTempMessage(setError, "Error updating password");
    }
  };

  const clearFields = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowPassword({ oldPassword: false, newPassword: false, confirmPassword: false });
    setError("");
    setMessage("");
  };

  return (
    <div className="bg-blue-100 border border-blue-100 rounded-3xl shadow-xl p-8 m-6 hover:shadow-2xl transition-shadow duration-300 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800 text-xl flex items-center gap-2">
          <Lock size={20} /> Change Password
        </h3>
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 border border-blue-200 rounded-lg transition-colors duration-200"
        >
          {editing ? "Cancel" : "Change"}
        </button>
      </div>

      {editing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PasswordField label="Old Password" name="oldPassword" value={passwordData.oldPassword} onChange={handleChange} show={showPassword.oldPassword} toggleShow={() => toggleShowPassword("oldPassword")} />
          <PasswordField label="New Password" name="newPassword" value={passwordData.newPassword} onChange={handleChange} show={showPassword.newPassword} toggleShow={() => toggleShowPassword("newPassword")} />
          <PasswordField label="Confirm Password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handleChange} show={showPassword.confirmPassword} toggleShow={() => toggleShowPassword("confirmPassword")} />
        </div>
      )}

      {editing && (
        <div className="flex justify-between mt-6">
          {/* Clear Button */}
          <button
            onClick={clearFields}
            className="flex items-center gap-2 text-red-500 px-5 py-3 rounded-xl hover:text-red-900 transition-colors duration-200 font-medium"
          >
            <Trash2 size={18} /> Clear
          </button>

          {/* Save Button */}
          <button
            onClick={savePassword}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
          >
            <Save size={18} /> Save Password
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}
      {message && <p className="mt-4 text-sm text-green-600 font-medium">{message}</p>}
    </div>
  );
}

function PasswordField({ label, name, value, onChange, show, toggleShow }) {
  return (
    <div className="flex flex-col relative">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="mt-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-[36px] text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
