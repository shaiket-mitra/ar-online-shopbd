import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeaders from "../shared/SectionHeaders";

export default function OurStorySec() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50 overflow-hidden rounded-xl">
      <div className="max-w-6xl mx-auto">
        <SectionHeaders
          subHeader="Our Journey"
          mainHeader="Discover Our Story"
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          <motion.div 
            className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image 
              src="/ChatGPT-Image.png" 
              alt="Our bakery story"
              fill
              className="object-cover transition-all duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.p 
              className="text-gray-600 leading-relaxed mb-6"
              whileHover={{ x: 5 }}
            >
              Founded in 2010, our bakery began as a small family passion project. 
              What started with just a few recipes passed down through generations 
              has blossomed into a beloved local institution.
            </motion.p>
            
            <motion.p 
              className="text-gray-600 leading-relaxed mb-6"
              whileHover={{ x: 5 }}
            >
              Every creation from our kitchen carries the love and attention to 
              detail that defines our approach. We source only the finest ingredients 
              and craft each item with the same care we would for our own family.
            </motion.p>
            
            <motion.p 
              className="text-gray-600 leading-relaxed"
              whileHover={{ x: 5 }}
            >
              Today, we&apos;re proud to serve our community while staying true to 
              our roots - baking with heart, tradition, and a touch of innovation.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              {[
                { value: "15+", label: "Years Experience" },
                { value: "100+", label: "Happy Customers Daily" },
                { value: "50+", label: "Unique Recipes" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-pink-100 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ y: -5, scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <h4 className="font-bold text-pink-600 text-xl">{item.value}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}