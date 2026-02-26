"use client";

import { GrUserAdmin } from "react-icons/gr";
import { FiShoppingBag, FiUserCheck, FiArrowUpCircle } from "react-icons/fi";
import MenuItem from "./MenuItem";
import { useState } from "react";
import BecomeSellerModal from "@/components/Modal/BecomeSellerModal";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface CustomerMenuProps {
  onItemClick?: () => void;
}

const CustomerMenu = ({ onItemClick }: CustomerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { sessionUser } = useAuth();

  const closeModal = () => setIsOpen(false);

  async function requestHandler() {
    try {
      const { data } = await axios.patch("/api/dashboard/customer-request", {
        email: sessionUser?.email,
      });
      toast.success(data.message, {
        icon: "🎉",
        style: {
          background: "#4BB543",
          color: "#fff",
        },
      });
    } catch (error: any) {
      toast.error(error.response.data.message, {
        icon: "⚠️",
        style: {
          background: "#FF3333",
          color: "#fff",
        },
      });
    } finally {
      closeModal();
      if (onItemClick) onItemClick();
    }
  }

  return (
    <div className="space-y-1">
      <MenuItem
        icon={FiShoppingBag}
        label="My Orders"
        address="/dashboard/customer/my-orders"
        onClick={onItemClick}
      />

      {sessionUser?.role === "customer" && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                     text-gray-700 hover:bg-pink-50 hover:text-pink-600 cursor-pointer"
        >
          <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
            <GrUserAdmin className="w-5 h-5" />
          </div>
          <span className="ml-3 font-medium">Become A Seller</span>
          <span className="ml-auto flex items-center text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
            <FiArrowUpCircle className="mr-1" /> Upgrade
          </span>
        </motion.div>
      )}

      {sessionUser?.role === "seller" && (
        <div className="flex items-center px-4 py-3 rounded-lg bg-green-50 text-green-700">
          <div className="p-2 rounded-lg bg-green-100 text-green-600">
            <FiUserCheck className="w-5 h-5" />
          </div>
          <span className="ml-3 font-medium">Seller Account</span>
          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Active
          </span>
        </div>
      )}

      <BecomeSellerModal
        closeModal={closeModal}
        isOpen={isOpen}
        requestHandler={requestHandler}
      />
    </div>
  );
};

export default CustomerMenu;