"use client";

import { GrLogout } from "react-icons/gr";
import { FiSettings } from "react-icons/fi";
import MenuItem from "./Menu/MenuItem";
import AdminMenu from "./Menu/AdminMenu";
import SellerMenu from "./Menu/SellerMenu";
import CustomerMenu from "./Menu/CustomerMenu";
import logo from "../../../assets/images/logo-flat.png";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface SidebarProps {
  onItemClick?: () => void;
}

const Sidebar = ({ onItemClick }: SidebarProps) => {
  const { sessionUser } = useAuth();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo/Brand Section */}
      <div className="flex justify-center items-center px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600">
        <Link 
          href="/" 
          className="text-2xl font-bold text-white flex items-center"
          onClick={onItemClick}
        >
          <Image src={"/ar_shop_logo.png"} alt="shop logo" width={200} height={200} className=" sm:w-44 w-[8rem]"></Image>
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-1">
          <CustomerMenu onItemClick={onItemClick} />
          {(sessionUser?.role === "Seller" || sessionUser?.role === "Admin") && (
            <SellerMenu onItemClick={onItemClick} />
          )}
          {sessionUser?.role === "Admin" && <AdminMenu onItemClick={onItemClick} />}
          <MenuItem
          icon={FiSettings}
          label="Profile Settings"
          address="/dashboard/profile"
          onClick={onItemClick}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            await signOut();
            if (onItemClick) onItemClick();
          }}
          className="flex items-center w-full px-4 py-3 mt-2 text-gray-700 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <GrLogout className="w-5 h-5 mr-3" />
          Logout
        </motion.button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;