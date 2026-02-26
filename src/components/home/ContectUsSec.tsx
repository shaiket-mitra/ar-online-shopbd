import { motion } from 'framer-motion';
import SectionHeaders from '../shared/SectionHeaders';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function ContactUsSec() {
  const contactItems = [
    {
      icon: <FiPhone className="text-2xl" />,
      title: "Call Us",
      details: ["+8801959994969", "+8801571515000"],
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: <FiMail className="text-2xl" />,
      title: "Email Us",
      details: ["himu.mitra97@gmail.com", "shanto.mitra33@gmail.com"],
      color: "text-pink-500",
      bg: "bg-pink-50"
    },
    {
      icon: <FiMapPin className="text-2xl" />,
      title: "Visit Us",
      details: ["Amtolarpar", "Barguna, Bangladesh"],
      color: "text-green-500",
      bg: "bg-green-50"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeaders
          subHeader="GET IN TOUCH"
          mainHeader="Contact Us"
        />

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-xl ${item.bg} shadow-sm hover:shadow-md transition-all duration-300`}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`${item.color} mb-4 flex justify-center`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
              <div className="space-y-2">
                {item.details.map((detail, i) => (
                  <p key={i} className="text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <input 
                type="email" 
                placeholder="Your Email" 
                className="bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-2">
              <textarea 
                placeholder="Your Message" 
                rows={4}
                className="bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>
            </motion.div>
            <motion.div className="md:col-span-2 flex justify-center">
              <motion.button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}