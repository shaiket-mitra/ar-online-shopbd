"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <p className="text-xl font-semibold text-gray-700">Logging out...</p>
        <div className="mt-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
