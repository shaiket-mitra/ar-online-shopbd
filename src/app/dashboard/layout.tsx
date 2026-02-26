"use client";

import { useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar/Sidebar";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard Overview" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-pink-600">Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </header>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block fixed inset-y-0 left-0 z-20 w-64 h-full bg-white border-r border-gray-200 shadow-sm">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-10 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed z-20 w-64 h-full bg-white shadow-xl md:hidden"
            >
              <Sidebar onItemClick={() => setSidebarOpen(false)} />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;