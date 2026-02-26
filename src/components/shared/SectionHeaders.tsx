import { motion } from "framer-motion";
import Image from "next/image";

export default function SectionHeaders({ 
  subHeader, 
  mainHeader 
}: { 
  subHeader: string; 
  mainHeader: string 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <motion.span 
        className="text-pink-500 uppercase tracking-widest text-sm font-medium block mb-3"
        whileHover={{ scale: 1.05 }}
      >
        {subHeader}
      </motion.span>
      <motion.h2 
        className="text-4xl md:text-5xl font-bold text-gray-800 relative pb-6"
        whileHover={{ scale: 1.02 }}
      >
        {mainHeader}
        <motion.span 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-pink-400 rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.h2>
    </motion.div>
  );
}