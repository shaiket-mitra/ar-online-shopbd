"use client";

import Card from "@/components/home/Card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { GiCakeSlice } from "react-icons/gi";

export default function AllCakePage() {
  const { data: cakes = [], isLoading } = useQuery({
    queryKey: ["all-cakes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/get-cakes");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Our <span className="text-pink-500">Complete</span> Collection
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through all {cakes.length} delicious cakes we have to offer
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center relative"
      >
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-10 w-24 h-24 bg-pink-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-200 rounded-full opacity-15 blur-xl"></div>

        {/* Main heading with gradient text */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent relative z-10">
          <span className="relative">
            Our Complete Collection
            {/* Underline effect */}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full"></span>
          </span>
        </h1>

        {/* Subtitle with animated decoration */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
          <p className="text-lg text-gray-600 font-medium px-4">
            {cakes.length} Delicious Options Available
          </p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
        </div>

        {/* Floating cake icons */}
        <div className="absolute -top-8 right-10 text-pink-300 text-3xl animate-float">
          <GiCakeSlice />
        </div>
        <div className="absolute bottom-2 left-12 text-pink-200 text-2xl animate-float-delayed">
          <GiCakeSlice />
        </div>
      </motion.div>

      {cakes && cakes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cakes.map((cake: any, index: number) => (
            <motion.div
              key={cake._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            >
              <Card cake={cake} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 bg-pink-50 rounded-xl"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full text-pink-500 mb-4">
            <GiCakeSlice className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-gray-700">
            No Cakes Available
          </h3>
          <p className="text-gray-500 mt-2">
            We&apos;re currently preparing fresh batches of delicious cakes!
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500">
          Showing all {cakes.length} items in our collection
        </p>
      </motion.div>
    </div>
  );
}
