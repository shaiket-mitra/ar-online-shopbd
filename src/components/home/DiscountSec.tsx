import Card from "./Card";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiTag } from "react-icons/fi";
import ViewAllProductsCard from "./ViewAllProductsCard";

const DiscountSec = ({ products }: any) => {
  const discountedProducts = products?.filter(
    (product: any) => product?.discount?.isDiscounted
  );
  const discountedTenProducts = products
    ?.filter((product: any) => product?.discount?.isDiscounted)
    .slice(0, 10);

  return (
    <section className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <Link href={`/all-discountedProducts`} className="group">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                <span className="text-pink-400">Hot</span> Deals
              </h2>
              <p className="text-gray-600 mt-2">
                Limited-time offers - save on these sweet deals
              </p>
            </div>
            {/* <div className="flex items-center space-x-2 ">
              <span className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full font-medium flex items-center min-w-28">
                <FiTag className="mr-2" />
                {discountedCakes.length} Items
              </span>
              <span className="group-hover:translate-x-1 transition-transform duration-300 text-pink-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </div> */}
          </div>
        </Link>
      </motion.div>

      {discountedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {discountedTenProducts.map((product: any, index: number) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card product={product} />
            </motion.div>
          ))}
          <ViewAllProductsCard
            category={"Discounted"}
            quality={discountedProducts.length}
            linkAdd="/all-discountedProducts"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center py-16 bg-pink-50 rounded-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-pink-300"
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
          <h3 className="text-xl font-medium text-gray-700 mt-4">
            No Discounted Products Available
          </h3>
          <p className="text-gray-500 mt-2">
            Check back later for sweet deals!
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
          >
            Browse All Products
          </Link>
        </motion.div>
      )}
    </section>
  );
};

export default DiscountSec;
