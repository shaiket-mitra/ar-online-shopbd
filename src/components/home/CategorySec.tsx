"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Product = {
  id: number;
  name: string;
  category: string; // expected: "new-arrival" etc.
};

type Props = {
  products: Product[];
};

type CategoryMeta = {
  label: string;
  image: string;
  description: string;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  "new-arrival": {
    label: "New Arrival",
    image: "/new-arrival.jpg",
    description: "Discover the latest watch collections",
  },
  "best-selling": {
    label: "Best Selling",
    image: "/best-selling.jpg",
    description: "Our most popular timepieces",
  },
  "limited-edition": {
    label: "Limited Edition",
    image: "/limited.jpg",
    description: "Exclusive premium watches",
  },
  "couple-watch": {
    label: "Couple Watch",
    image: "/couple.jpg",
    description: "Perfect matching watches for couples",
  },
  "gift-collection": {
    label: "Gift Collection",
    image: "/gift.jpg",
    description: "Elegant watches for special gifting",
  },
  "eid-special-offer": {
    label: "Eid Special Offer",
    image: "/eid.jpg",
    description: "Special festive discounts & deals",
  },
};

function normalizeCategory(input: string) {
  // supports old data too: "New Arrival" -> "new-arrival"
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function CategorySec({ products }: Props) {
  const uniqueCategories = Array.from(
    new Set(products.map((p) => normalizeCategory(p.category)))
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Explore Our <span className="text-[#DB2777]">Collections</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Discover premium watches curated for every style and occasion.
        </motion.p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {uniqueCategories.map((categorySlug) => {
          const meta = CATEGORY_META[categorySlug];

          const imageSrc = meta?.image || "/product-logo.png";
          const title = meta?.label || categorySlug.replace(/-/g, " ");
          const description = meta?.description || "Premium Watch Collection";

          return (
            <motion.div
              key={categorySlug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/category/${categorySlug}`}
                className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 bg-pink-50"
              >
                <div className="relative aspect-square">
                  <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                </div>

                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#DB2777] transition-colors">
                    {title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}