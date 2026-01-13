"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, LockKeyhole, User, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // disables button after success
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // Basic validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call your API route
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        setIsSubmitting(false);
        return;
      }

      // Success message
      setSuccess(
        "Account Registered. It will undergo verification process. Wait for an email for verification."
      );

      // Clear form
      e.target.reset();

      // Keep button disabled after success to prevent re-submission
      setIsSubmitting(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-blue-500">
      <div className="text-center bg-white/30 backdrop-blur-md rounded-xl p-8 w-96 shadow-md">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mx-auto">
          <Image src="/images/logo.png" alt="LumiDent Logo" width={100} height={100} className="mx-auto" />
          <Image src="/images/logoName.png" alt="LumiDent Logo" width={150} height={150} className="mx-auto mb-4" />

          <p className="font-sans font-bold text-xs">
            Create your account
          </p>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {success && <p className="text-green-500 text-xs mt-2">{success}</p>}

          <form onSubmit={handleSignup}>
            {/* Username */}
            <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full mt-4">
              <User className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="text-xs flex-1 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full mt-4">
              <Mail className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="text-xs flex-1 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full mt-4 relative">
              <LockKeyhole className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="text-xs flex-1 outline-none"
                required
              />
              <span
                className="absolute right-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye className="w-4 h-4 text-gray-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting} // disables after success
              className={`bg-blue-600 text-white px-4 py-2 rounded mt-6 w-full font-extrabold text-sm transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              Sign Up
            </button>
          </form>

          {/* Back to Login */}
          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center mt-4 text-blue-600 hover:underline text-xxs font-sans"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
