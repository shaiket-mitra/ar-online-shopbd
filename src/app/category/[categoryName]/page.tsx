"use client";

import Card from "@/components/home/Card";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GiCakeSlice } from "react-icons/gi";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function CategoryPage() {
  const params = useParams();
  const categoryName = (params?.categoryName as string) || "";

  const title = categoryName ? titleFromSlug(categoryName) : "";

  const { data: productsByCategory = [], isLoading } = useQuery({
    queryKey: ["productsByCategory", categoryName],
    enabled: !!categoryName, // ✅ params না আসা পর্যন্ত call করবে না
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/category/${encodeURIComponent(categoryName)}`, // ✅ slug 그대로
      );
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center relative"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 relative">
          <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
            {title} Collection
          </span>
          <motion.span
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </h1>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center bg-pink-100 text-pink-600 px-4 py-2 rounded-full mt-4"
        >
          <GiCakeSlice className="mr-2" />
          <span className="font-medium">
            {productsByCategory.length} {title} Items Available
          </span>
        </motion.div>
      </motion.div>

      {productsByCategory.length > 0 ? (
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
        <div className="text-center py-16 bg-pink-50 rounded-xl shadow-inner">
          <h3 className="text-xl font-medium text-gray-700">
            No Items Available
          </h3>
          <p className="text-gray-500 mt-2">
            We’re currently updating {title}!
          </p>
        </div>
      )}
    </div>
  );
}
