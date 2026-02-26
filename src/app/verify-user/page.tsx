"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

export default function VerifyUserPage() {
  const { sessionUser } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const router = useRouter();
  async function handleResendOtp() {
    setResendingOtp(true);
    const { data } = await axios.patch("/api/resendOtp-verifyUser", { email });
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
    setResendingOtp(false);
  }
  useEffect(() => {
    const storedEmail = localStorage.getItem("registeringEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No email found in local storage.");
      router.push("/register");
    }
  }, [router]);

  async function handleVerifyUser() {
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.patch("/api/verify-user", { otp, email });
      if (data.success) {
        toast.success("Verification successful!");
        if (sessionUser) {
          router.push("/");
        } else {
          router.push("/login");
        }
      } else {
        toast.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="card max-w-sm w-full shadow-2xl bg-white border border-pink-200">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-pink-400 mb-2">
            Verify User
          </h1>
          <p className="text-gray-700 text-center">
            Please enter the OTP sent to your..
          </p>
          <p className="text-gray-700 text-center">{email}</p>

          <div className="flex justify-center my-5">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {resendingOtp ? (
            <p className="text-center text-pink-400 flex items-center justify-center gap-2">
              Sending OTP{" "}
              <span className="loading loading-dots loading-md"></span>
            </p>
          ) : (
            <button onClick={handleResendOtp} className="link link-secondary">
              Resend OTP
            </button>
          )}

          <button
            onClick={handleVerifyUser}
            className="btn btn-secondary mt-4 w-full"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
