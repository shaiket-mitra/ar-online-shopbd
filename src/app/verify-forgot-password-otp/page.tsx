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

export default function VerifyForgotPassOtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const storedEmail = localStorage.getItem("registeringEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No email found in local storage.");
      router.push("/register");
    }
  }, [router]);

  async function handleResendOtp() {
    setResendingOtp(true);
    const { data } = await axios.patch("/api/resendOtp-forgotPass", { email });
    if (data.success) {
      toast.success(data.message);
      router.push("/login");
    } else {
      toast.error(data.message);
    }
    setResendingOtp(false);
  }

  async function handleVerifyEmail() {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.patch("/api/verify-forgotPass-otp", {
        otp,
        email,
      });
      if (data.success) {
        toast.success(
          "Verification successful! Readymade password Send to your email"
        );
        router.push("/login");
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
            Verify Email
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
            <p className="text-center text-pink-400">
              Sending OTP{" "}
              <span className="loading loading-dots loading-md"></span>
            </p>
          ) : (
            <button onClick={handleResendOtp} className="link link-secondary">
              Resend OTP
            </button>
          )}

          <p className="p-2 bg-pink-400 rounded">
            After submiting OTP, a readymade password will be send to your email
            for login.
          </p>

          <button
            onClick={handleVerifyEmail}
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
