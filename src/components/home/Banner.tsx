import coverImg from "../../../public/cake3.jpg";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Banner() {
  return (
    <div className="relative w-full h-[32rem] rounded-2xl overflow-hidden shadow-xl">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={coverImg}
          alt="Delicious product selection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Everything is batter with a bite of{" "}
            <span className="text-pink-400">Product</span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-pink-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Cake is the missing piece that makes every day complete, a simple
            yet delicious joy in life
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              onClick={() => {
                const target = document.getElementById("products");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-pink-600 transition duration-300 ease-out rounded-full shadow-lg hover:shadow-xl active:scale-95 bg-white hover:bg-pink-50"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 opacity-0 group-hover:opacity-100 transition duration-300 ease-out"></span>
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  );
}
