"use client";

import Card from "@/components/home/Card";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GiCakeSlice } from "react-icons/gi";

export default function CategoryPage() {
  const { categoryName } = useParams<any>();
  const capitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  
  const { data: productsByCategory = [], isLoading } = useQuery({
    queryKey: ["productsByCategory", categoryName],
    queryFn: async () => {
      const { data } = await axios.get(`/api/category/${capitalized}`);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center relative"
      >
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-10 w-24 h-24 bg-pink-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-200 rounded-full opacity-15 blur-xl"></div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 relative">
          <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
            {capitalized} Collection
          </span>
          <motion.span
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </h1>

        {/* Count badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center bg-pink-100 text-pink-600 px-4 py-2 rounded-full mt-4"
        >
          <GiCakeSlice className="mr-2" />
          <span className="font-medium">
            {productsByCategory.length} {capitalized} Cakes Available
          </span>
        </motion.div>

        {/* Floating cake icons */}
        <motion.div
          className="absolute -top-8 right-10 text-pink-300 text-3xl"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
          }}
        >
          <GiCakeSlice />
        </motion.div>
      </motion.div>

      {/* Cake Grid */}
      {productsByCategory && productsByCategory.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {productsByCategory.map((product: any, index: number) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              whileHover={{ y: -5 }}
            >
              <Card product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 bg-pink-50 rounded-xl shadow-inner"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full text-pink-500 mb-4">
            <GiCakeSlice className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-gray-700">
            No {capitalized} Cakes Available
          </h3>
          <p className="text-gray-500 mt-2">
            We&lsquo;re currently preparing fresh batches of {categoryName} cakes!
          </p>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium">
          <GiCakeSlice className="mr-2" />
          Showing all {productsByCategory.length} {categoryName} cakes
        </div>
      </motion.div>
    </div>
  );
}