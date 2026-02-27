import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import Card from "./Card";
import LoadingSpinner from "../shared/LoadingSpinner";
import CategorySec from "./CategorySec";
import DiscountSec from "./DiscountSec";
import Link from "next/link";
import ViewAllProductsCard from "./ViewAllProductsCard";

const Products = () => {
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/api/get-products");
      const payload = res.data;

      // common shapes handle
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.products)) return payload.products;
      if (Array.isArray(payload?.data)) return payload.data;

      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div id="products" className="">
      {/* Category Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CategorySec products={products} />
      </motion.section>

      {/* Discount Section */}
      {/* <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-16"
      >
        <DiscountSec products={products} />
      </motion.section> */}

      {/* Featured Cakes */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <Link href={`/all-products`} className="group">
            <div className="flex items-center justify-between gap-5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  <span className="text-pink-400">Our</span> Collections
                </h2>
                <p className="text-gray-600 mt-2">
                  Our Letest Collections - save on these sweet deals
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
            {products.slice(0, 10).map((product: any, index: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              >
                <Card product={product} refetch={refetch} />
              </motion.div>
            ))}
            <ViewAllProductsCard
              quality={products.length}
              linkAdd="/all-products"
            />
          </div>
        ) : (
          <div className="text-center py-16 bg-pink-50 rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full text-pink-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              No Products Available
            </h3>
            <p className="text-gray-500 mt-2">
              We&apos;re currently baking new delicious products!
            </p>
          </div>
        )}
      </motion.section>

      {/* View All CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-16"
      ></motion.div>
    </div>
  );
};

export default Products;
