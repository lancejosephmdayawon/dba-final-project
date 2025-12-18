"use client";
import React from "react";

export default function SmallSwitch({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      {/* Switch container */}
      <div
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors
          ${value ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform
            ${value ? "translate-x-4" : "translate-x-1"}`}
        />
      </div>
      {/* Label */}
      {label && <span className="text-xs text-gray-700">{label}</span>}
    </label>
  );
}
