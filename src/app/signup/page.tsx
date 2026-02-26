"use client";

import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    localStorage.setItem("registeringEmail", email);
    const userInfo = {
      name,
      email,
      password,
    };

    try {
      const data = await axios.post("/api/register", userInfo);
      if (data.status === 200) {
        router.push("/verify-user");
        toast.success("Signup Successful. Please verify first.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
      // toast.success("Signup Successful");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="hero min-h-screen ">
      <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-gradient-to-b from-pink-50 to-gray-50">
        <div className="card-body">
          <h1 className="text-4xl font-bold text-center text-pink-400 mb-2">
            Register
          </h1>
          <p className="text-sm text-gray-400 text-center mb-4">
            Welcome to Mitra Mart
          </p>
          <form
            onSubmit={handleSubmit}
            action=""
            className="space-y-6 ng-untouched ng-pristine ng-valid"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-pink-400 bg-white text-gray-900"
                  data-temp-mail-org="0"
                />
              </div>
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
                  data-temp-mail-org="0"
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm mb-2">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
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
          <p className="px-6 text-sm text-center text-gray-400 mt-5">
            Already have an account?{" "}
            <Link
              href="/login"
              className="hover:underline hover:text-pink-400 text-gray-600"
            >
              Login
            </Link>
            .
          </p>
        </div>
      </div>
    </div>

    // <div className="flex justify-center items-center min-h-screen bg-white">
    //   <div className="flex flex-col max-w-md p-6 rounded-lg sm:p-10 bg-gradient-to-b from-pink-50 to-gray-50 text-gray-900">
    //     <div className="mb-8 text-center">
    //       <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
    //       <p className="text-sm text-gray-400">Welcome to cakeNet</p>
    //     </div>
    //     <form
    //       onSubmit={handleSubmit}
    //       // noValidate=""
    //       action=""
    //       className="space-y-6 ng-untouched ng-pristine ng-valid"
    //     >
    //       <div className="space-y-4">
    //         <div>
    //           <label htmlFor="email" className="block mb-2 text-sm">
    //             Name
    //           </label>
    //           <input
    //             type="text"
    //             name="name"
    //             id="name"
    //             placeholder="Enter Your Name Here"
    //             className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
    //             data-temp-mail-org="0"
    //           />
    //         </div>
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
    //             data-temp-mail-org="0"
    //           />
    //         </div>
    //         <div>
    //           <div className="flex justify-between">
    //             <label htmlFor="password" className="text-sm mb-2">
    //               Password
    //             </label>
    //           </div>
    //           <input
    //             type="password"
    //             name="password"
    //             autoComplete="new-password"
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

    //     <p className="px-6 text-sm text-center text-gray-400 mt-5">
    //       Already have an account?{" "}
    //       <Link
    //         href="/login"
    //         className="hover:underline hover:text-pink-400 text-gray-600"
    //       >
    //         Login
    //       </Link>
    //       .
    //     </p>
    //   </div>
    // </div>
  );
};

export default SignUp;
