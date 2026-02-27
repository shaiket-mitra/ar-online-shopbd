"use client";

import { AiOutlineMenu } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import avatarImg from "@/assets/images/placeholder.jpg";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const Navbar = () => {
  const { sessionUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Redirect if token expired
  useEffect(() => {
    if (sessionUser?.tokenExpired) {
      router.push("/logout");
    }
  }, [sessionUser, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.startsWith("/dashboard")) return null;

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.42, 0, 0.58, 1], // cubic-bezier safe
      },
    },
  };

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.42, 0, 0.58, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
        ease: [0.42, 0, 1, 1],
      },
    },
  };

  const buttonHover = { scale: 1.03, transition: { duration: 0.2 } } as const;
  const buttonTap = { scale: 0.98 } as const;

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full bg-gradient-to-r from-pink-600 to-pink-400 sticky top-0 z-50 shadow-lg"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-[4.7rem]">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xl md:text-2xl lg:text-2xl font-bold bg-white bg-clip-text text-transparent"
            >
              <Image
                src={"/ar_shop_logo.png"}
                alt="shop logo"
                width={200}
                height={200}
                className="sm:w-40 w-[8.2rem]"
              />
            </motion.span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {sessionUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Profile Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="User menu"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative h-9 w-9 rounded-full border-2 border-pink-100 overflow-hidden"
                  >
                    <Image
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      src={sessionUser?.image || avatarImg}
                      alt="Profile"
                      fill
                      sizes="36px"
                    />
                  </motion.div>
                  <AiOutlineMenu className="text-gray-100 w-4 h-4" />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    >
                      <div className="py-1">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {sessionUser?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {sessionUser?.email}
                          </p>
                        </div>

                        {sessionUser?.role === "Customer" ? (
                          <motion.div whileHover={{ x: 2 }}>
                            <Link
                              href="/dashboard/customer/my-orders"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              <BsBoxSeam className="mr-3 h-5 w-5 text-pink-400" />
                              My Orders
                            </Link>
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ x: 2 }}>
                            <Link
                              href="/dashboard/statistics"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              <MdDashboard className="mr-3 h-5 w-5 text-pink-400" />
                              Dashboard
                            </Link>
                          </motion.div>
                        )}

                        <motion.div whileHover={{ x: 2 }}>
                          <button
                            onClick={async () => {
                              await signOut();
                              setIsOpen(false);
                            }}
                            className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                          >
                            <FiLogOut className="mr-3 h-5 w-5 text-pink-400" />
                            Sign out
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 bg-white rounded-md transition-colors"
                  >
                    Sign in
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md shadow-sm transition-colors"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
