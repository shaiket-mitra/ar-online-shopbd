"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Cake = {
  id: number;
  name: string;
  category: string;
};

type Props = {
  cakes: Cake[];
};

const categoryImages = {
  birthday: "/wed.jpg",
  chocolate: "/chocolate.webp",
  wedding: "/ww.webp",
  anniversary: "/aun.jpg",
  cupcakes: "/cup.webp",
  custom: "/cake3.jpg",
};

export default function CategorySec({ cakes }: Props) {
  const uniqueCategories = Array.from(
    new Set(cakes.map((cake) => cake.category.toLowerCase()))
  );

  return (
    <section className="pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Shop by <span className="text-pink-400">Category</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Discover our delicious cakes organized by special occasions and
          flavors
        </motion.p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {uniqueCategories.map((category) => {
          const imageSrc = categoryImages[category as keyof typeof categoryImages] || "/cake-logo.png";

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              whileHover={{ y: -5 }}
            >
              <Link
                href={`/category/${category}`}
                className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-pink-100"
              >
                <div className="relative aspect-square">
                  <Image
                    src= {imageSrc}
                    alt={category}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-gray-800 group-hover:text-pink-500 transition-colors capitalize">
                    {category}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category === "birthday" && "Celebration Cakes"}
                    {category === "wedding" && "Elegant Designs"}
                    {category === "chocolate" && "Rich & Decadent"}
                    {category === "custom" && "Personalized Creations"}
                    {category === "anniversary" && "Romantic Treats"}
                    {category === "cupcakes" && "Mini Delights"}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-12"
      ></motion.div>
    </section>
  );
}
