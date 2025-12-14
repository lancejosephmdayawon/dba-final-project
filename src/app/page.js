import Image from "next/image";
import { Mail } from "lucide-react";
import { LockKeyhole } from "lucide-react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-blue-500">
      {/* Outer Card */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 text-center">
        {/* Inner Card */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md w-72 mx-auto">
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

          {/* Input Field Email */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full mt-4">
            {/* Icon */}
            <Mail className="text-gray-400 w-5 h-5 mr-2" />
            {/* Input Field */}
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 outline-none"
            />
          </div>
          {/* Input Field Password */}
          <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full mt-4">
            {/* Icon */}
            <LockKeyhole className="text-gray-400 w-5 h-5 mr-2" />
            {/* Input Field */}
            <input
              type="password"
              placeholder="Enter your email"
              className="flex-1 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
