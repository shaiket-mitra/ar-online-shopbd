"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();

    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/forgot-password", { email });
      if (data.success) {
        localStorage.setItem("registeringEmail", email);
        toast.success(data.message);
        router.push("/verify-forgot-password-otp");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-gradient-to-b from-pink-50 to-gray-50">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-pink-400 mb-4">
            Forgot Password?
          </h1>
          <form onSubmit={handleSendOtp}>
            <fieldset className="fieldset">
              <label htmlFor="email" className="fieldset-label mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                className="btn btn-secondary mt-4 w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
