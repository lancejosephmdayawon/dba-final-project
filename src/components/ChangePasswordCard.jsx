"use client";

import { useState } from "react";
import { Lock, Save, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordCard() {
  const [editing, setEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const toggleShowPassword = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const showTempMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(""), 10000); // clear after 10s
  };

  const savePassword = async () => {
    setError("");
    setMessage("");

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
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
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

  return (
    <div className="bg-blue-100/70 border border-blue-200 rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Lock size={16} /> Change Password
        </h3>
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-300 rounded-lg"
        >
          {editing ? "Cancel" : "Change"}
        </button>
      </div>

      {editing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PasswordField
            label="Old Password"
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handleChange}
            show={showPassword.oldPassword}
            toggleShow={() => toggleShowPassword("oldPassword")}
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            show={showPassword.newPassword}
            toggleShow={() => toggleShowPassword("newPassword")}
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            show={showPassword.confirmPassword}
            toggleShow={() => toggleShowPassword("confirmPassword")}
          />
        </div>
      )}

      {editing && (
        <div className="flex justify-end mt-4">
          <button
            onClick={savePassword}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            <Save size={16} /> Save Password
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
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
        className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-2 top-[32px] text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
