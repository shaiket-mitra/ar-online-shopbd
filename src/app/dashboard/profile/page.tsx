"use client";

import coverImg from "../../../../public/cake3.jpg";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import UpdateProfileModal from "@/components/profile/UpdateProfileModal";
import ChangePassModal from "@/components/profile/ChangePassModal";
import Link from "next/link";
import { FiEdit2, FiKey, FiCheckCircle, FiUser } from "react-icons/fi";

const Profile = () => {
  const { sessionUser } = useAuth();

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        {/* Cover Image */}
        <div className="relative h-64">
          <Image
            src={coverImg}
            alt="Cover Photo"
            fill
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {sessionUser?.image ? (
                <Image
                  src={sessionUser.image}
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-xl h-32 w-32 object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-white bg-pink-100 shadow-xl flex items-center justify-center">
                  <FiUser className="text-pink-400 text-5xl" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-8 px-6 sm:px-8">
          {/* Profile Info */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              {sessionUser?.name || "User Name"}
            </h2>
            <p className="text-gray-600 mb-4">{sessionUser?.email || "user@example.com"}</p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {sessionUser?.role !== "customer" && (
                <span className="px-3 py-1 text-sm font-medium text-pink-800 bg-pink-100 rounded-full flex items-center">
                  {sessionUser?.role}
                </span>
              )}
              
              {sessionUser?.isVerified ? (
                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full flex items-center">
                  <FiCheckCircle className="mr-1" /> Verified
                </span>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span className="px-3 py-1 text-sm font-medium text-rose-800 bg-rose-100 rounded-full">
                    Not Verified
                  </span>
                  <Link
                    href="/verify-user"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition flex items-center shadow-md hover:shadow-lg"
                  >
                    Verify Account
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                const modal = document.getElementById("my_modal_3") as HTMLDialogElement | null;
                modal?.showModal();
              }}
              className="flex items-center justify-center gap-2 bg-white border border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <FiEdit2 /> Update Profile
            </button>
            
            <button
              onClick={() => {
                const modal = document.getElementById("change_pass") as HTMLDialogElement | null;
                modal?.showModal();
              }}
              className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <FiKey /> Change Password
            </button>
          </div>
        </div>

        {/* Modals */}
        <UpdateProfileModal />
        <ChangePassModal />
      </div>
    </div>
  );
};

export default Profile;