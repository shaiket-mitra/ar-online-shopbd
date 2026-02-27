"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        toast.error("Email or Password is incorrect!");
      } else if (response?.ok === true) {
        toast.success("Login successful!");
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect") || "/";
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login failed", error);
      toast.error("Google login failed");
      setGoogleLoading(false); // Fallback
    }
  };

  return (
    <div className="hero min-h-screen ">
      <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-gradient-to-b from-pink-50 to-gray-50">
        <div className="card-body">
          <h1 className="text-4xl font-bold text-center text-pink-400 mb-2">
            Login
          </h1>
          <p className="text-sm text-gray-400 text-center mb-4">
            Welcome to Mitra Mart
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Enter Your Email Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-pink-400 bg-white text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  id="password"
                  required
                  placeholder="*******"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-pink-400 bg-white text-gray-900"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-pink-400 hover:bg-pink-500 w-full rounded-md py-3 text-white"
              >
                {loading ? (
                  <TbFidgetSpinner className="animate-spin m-auto" />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full gap-2">
            <div className="flex-grow h-[1px] bg-gray-200" />
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-grow h-[1px] bg-gray-200" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-md py-2 text-sm bg-gray-100 transition min-h-11 max-h-11"
          >
            {googleLoading ? (
              <span className="loading loading-spinner text-pink-400"></span>
            ) : (
              <>
                <FcGoogle size={18} />
                Continue with Google
              </>
            )}
          </button>
          <div className="space-y-1">
            <Link
              href={"/forgot-password"}
              className="text-xs hover:underline hover:text-pink-400 text-gray-400"
            >
              Forgot password?
            </Link>
          </div>
          <p className="px-6 text-sm text-center text-gray-400 mt-5">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/signup"
              className="hover:underline hover:text-pink-400 text-gray-600"
            >
              Sign up
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
