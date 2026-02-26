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

      // if (result?.ok) {
      //   setLoading(false);
      //   const urlParams = new URLSearchParams(window.location.search);
      //   const redirectUrl = urlParams.get("redirect") || "/";
      //   router.push(redirectUrl);
      //   toast.success("Login Successful");
      // }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirect") || "/";
      await signIn("google", { callbackUrl: redirectUrl });
      // toast.success("Login Successful");
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      toast.error(err.message);
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

    // <div className="flex justify-center items-center min-h-screen bg-white">
    //   <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gradient-to-b from-pink-50 to-gray-50 text-gray-900">
    //     <div className="mb-8 text-center">
    //       <h1 className="my-3 text-4xl font-bold">Log In</h1>
    //       <p className="text-sm text-gray-400">
    //         Sign in to access your account
    //       </p>
    //     </div>
    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       <div className="space-y-4">
    //         <div>
    //           <label htmlFor="email" className="block mb-2 text-sm">
    //             Email address
    //           </label>
    //           <input
    //             type="email"
    //             name="email"
    //             id="email"
    //             required
    //             placeholder="Enter Your Email Here"
    //             className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
    //           />
    //         </div>
    //         <div>
    //           <label htmlFor="password" className="text-sm mb-2">
    //             Password
    //           </label>
    //           <input
    //             type="password"
    //             name="password"
    //             autoComplete="current-password"
    //             id="password"
    //             required
    //             placeholder="*******"
    //             className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
    //           />
    //         </div>
    //       </div>
    //       <div>
    //         <button
    //           type="submit"
    //           className="bg-pink-400 hover:bg-pink-500 w-full rounded-md py-3 text-white"
    //         >
    //           {loading ? (
    //             <TbFidgetSpinner className="animate-spin m-auto" />
    //           ) : (
    //             "Continue"
    //           )}
    //         </button>
    //       </div>
    //     </form>
    //     <div className="space-y-1">
    //       <button className="text-xs hover:underline hover:text-pink-400 text-gray-400">
    //         Forgot password?
    //       </button>
    //     </div>
    //     <div className="flex items-center pt-4 space-x-1">
    //       <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
    //       <p className="px-3 text-sm dark:text-gray-400">
    //         Login with social accounts
    //       </p>
    //       <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
    //     </div>
    //     <div
    //       onClick={handleGoogleSignIn}
    //       className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 cursor-pointer"
    //     >
    //       <FcGoogle size={32} />
    //       <p>Continue with Google</p>
    //     </div>
    //     <p className="px-6 text-sm text-center text-gray-400 mt-5">
    //       Don&apos;t have an account yet?{" "}
    //       <Link
    //         href="/signup"
    //         className="hover:underline hover:text-pink-400 text-gray-600"
    //       >
    //         Sign up
    //       </Link>
    //       .
    //     </p>
    //   </div>
    // </div>
  );
};

export default Login;
