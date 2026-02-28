"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CATEGORY_META,
  type WatchCategorySlug,
  titleFromSlug,
} from "@/utils/watchCategories";

type Product = {
  id: number;
  name: string;
  category: WatchCategorySlug; // ✅ এখন slug টাইপ
};

type Props = {
  products: Product[];
};

export default function CategorySec({ products }: Props) {
  // ✅ categoryCounts এখন WatchCategorySlug key নেবে
  const categoryCounts = products.reduce<Record<WatchCategorySlug, number>>(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<WatchCategorySlug, number>,
  );

  // ✅ keys কে WatchCategorySlug[] হিসেবে ধরছি
  const uniqueCategories = Object.keys(categoryCounts) as WatchCategorySlug[];

  return (
    <section className="py-16 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-gray-900"
        >
          Explore Our <span className="text-[#DB2777]">Categories</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          viewport={{ once: true }}
          className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Premium collections curated for every style and occasion.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {uniqueCategories.map((categorySlug, idx) => {
          const meta = CATEGORY_META[categorySlug]; // ✅ no error
          const title = meta?.label || titleFromSlug(categorySlug);
          const count = categoryCounts[categorySlug] ?? 0;

          return (
            <motion.div
              key={categorySlug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.03 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/category/${categorySlug}`}
                className="group relative block rounded-2xl bg-white px-4 py-5 sm:px-5 sm:py-6
                           border border-pink-200 shadow-sm hover:shadow-lg
                           transition-all duration-300"
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                             transition-opacity duration-300"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(219,39,119,0.35), 0 12px 30px rgba(219,39,119,0.10)",
                  }}
                />

                <div className="relative flex items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-semibold text-[#DB2777]">
                    {title}
                  </h3>

                  <span
                    className="shrink-0 rounded-full border border-gray-200 bg-gray-50
                               px-2.5 py-1 text-xs font-medium text-gray-700
                               group-hover:border-pink-200 group-hover:bg-pink-50
                               group-hover:text-[#DB2777] transition-colors"
                    aria-label={`${count} products`}
                  >
                    {count}
                  </span>
                </div>

                <div className="relative mt-4 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300 group-hover:bg-[#DB2777] transition-colors" />
                  <span className="group-hover:text-gray-700 transition-colors">
                    View collection
                  </span>
                  <span className="ml-auto group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
