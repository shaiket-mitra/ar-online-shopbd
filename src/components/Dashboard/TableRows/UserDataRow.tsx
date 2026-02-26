"use client";

import { useState } from "react";
import UpdateUserModal from "../../Modal/UpdateUserModal";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { FiCheckCircle, FiEdit } from "react-icons/fi";
import useAuth from "@/hooks/useAuth";

const UserDataRow = ({ user, refetch, index }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { image, name, email, role, status } = user || {};

  async function updateRole(selectedRole: any) {
    if (role === selectedRole) return;

    try {
      await axios.patch("/api/dashboard/admin/update-role", {
        email,
        role: selectedRole,
      });
      toast.success("Role updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to update role");
    } finally {
      setIsOpen(false);
    }
  }

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-gray-100 text-gray-800",
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors ">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {index}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center ">
          <div className="flex-shrink-0 h-10 w-10 relative">
            {image ? (
              <Image
                src={image}
                alt={name || "User avatar"}
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 640px) 50px, 100px"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {name || "Unknown"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {email || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {role || "user"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-xs">
        {user?.isVerified ? (
          <div className="px-3 py-1 font-medium text-green-800 bg-green-100 rounded-full flex items-center justify-center">
            <FiCheckCircle className="mr-1" /> Verified
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-3 py-1 font-medium text-rose-800 bg-rose-100 rounded-full">
              Not Verified
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => setIsOpen(true)}
          className="text-pink-600 hover:text-pink-900 flex items-center space-x-1"
        >
          <FiEdit className="h-4 w-4" />
          <span>Edit</span>
        </button>

        <UpdateUserModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          currentRole={role}
          updateRole={updateRole}
          userName={name}
        />
      </td>
    </tr>
  );
};

export default UserDataRow;
