"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    // Attempt login
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
      return;
    }

    // Get the session after successful login
    const session = await getSession();

    // Check if user's email is verified
    if (!session?.user?.email_verified) {
      // Throw error if email not verified
      setError("Account undergoing verification process.");
      return;
    }

    // Email is verified, redirect to user dashboard
    router.push(`/dashboard`);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen 
  bg-[linear-gradient(rgba(59,130,246,0.6),rgba(59,130,246,0.6)),url('/images/login-bg.jpg')] 
  bg-cover bg-center"
    >
      <div className="text-center bg-white/30 backdrop-blur-md rounded-xl p-8 w-96 shadow-md">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mx-auto">
          <Image
            src="/images/logo.png"
            alt="LumiDent Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
          <Image
            src="/images/logoName.png"
            alt="LumiDent Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <p className="font-sans font-bold text-xs">
            Welcome back! Please login to your account.
          </p>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <form onSubmit={handleLogin}>
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
                {showPassword ? (
                  <Eye className="w-4 h-4 text-gray-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </span>
            </div>

            {/* Forgot Password
            <div className="justify-self-end mt-2 flex items-center">
              <a href="#" className="text-blue-600 text-xxs hover:underline">
                Forgot Password?
              </a>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded mt-6 w-full font-extrabold text-sm hover:bg-blue-700 transition-colors"
            >
              Log In
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-xxs font-sans mt-2">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
