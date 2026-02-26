"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ReactElement } from "react";

interface MenuItemProps {
  label: string;
  address: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const MenuItem = ({ label, address, icon: Icon, onClick }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === address;

  return (
    <motion.li 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="list-none"
    >
      <Link
        href={address}
        onClick={onClick}
        className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md"
            : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <div className={`p-2 rounded-lg ${
          isActive ? "bg-white/20" : "bg-pink-100 text-pink-600"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="ml-3 font-medium">{label}</span>
        
        {isActive && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute right-4 w-2 h-2 bg-white rounded-full"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.li>
  );
};

export default MenuItem;