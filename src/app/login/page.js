"use client";
import React from "react";
import Image from "next/image";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Components
import SmallSwitch from "@/components/SmallSwitch";

export default function LoginForm() {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-blue-500">
      {/* Outer Card */}
      <div className="text-center bg-white/30 backdrop-blur-md rounded-xl p-8 w-96 shadow-md">
        {/* Inner Card */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mx-auto">
          <Image
            src="/images/logo.png"
            alt="LumiDent Logo"
            width={100}
            height={100}
            className="mx-auto"
            style={{ objectFit: "contain" }}
          />
          <Image
            src="/images/logoName.png"
            alt="LumiDent Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
            style={{ objectFit: "contain" }}
          />
          <p className="font-sans font-bold text-xs">
            Welcome back! Please Login your account.
          </p>
        <form method="POST">
          {/* Input Field Email */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full mt-4">
            {/* Icon */}
            <Mail className="text-gray-400 w-5 h-5 mr-2" />
            {/* Input Field */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="text-xs flex-1 outline-none"
            />
          </div>
          {/* Input Field Password */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full mt-4 relative">
            {/* Lock Icon */}
            <LockKeyhole className="text-gray-400 w-5 h-5 mr-2" />

            {/* Password Input */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="text-xs flex-1 outline-none"
            />

            {/* Show/Hide Icon */}
            <span
              className="absolute right-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </span>
          </div>
          {/* Remember Me Switch and Forgot Password */}
          <div className="grid grid-cols-2 grid-rows-1 mt-4">
            <SmallSwitch
              label="Remember Me"
              value={rememberMe}
              onChange={setRememberMe}
            />
            <div className="justify-self-end flex items-center">
              <a
                href="#"
                className="text-blue-600 text-xxs hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </div>
          {/* Login Button */}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-6 w-full font-extrabold text-sm hover:bg-blue-700 transition-colors">
            Log In
          </button>
        </form>
        {/* Paragraph below Login */}
        <p className="text-xxs font-sans mt-2">Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a></p>

        </div>
      </div>
    </div>
  );
}
