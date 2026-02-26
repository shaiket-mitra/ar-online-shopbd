import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import PurchaseModal from "../Modal/PurchaseModal";
import ConfirmOrderModel from "../Modal/ConfirmOrderModel";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const Card = ({ cake, refetch }: any) => {
  const { name, description, category, price, image, _id, discount } = cake || {};

  const router = useRouter();
  const { sessionUser } = useAuth();

  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const closePurchaseModal = () => setPurchaseOpen(false);

  const handlePurchaseClick = () => {
    setPurchaseOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="col-span-1"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl border border-gray-100">
        {/* Clickable Section */}
        <Link href={`/cake/${_id}`} className="group block">
          <div className="relative overflow-hidden">
            <Image
              src={image}
              alt={name}
              width={400}
              height={300}
              className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {discount?.isDiscounted && (
              <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {Math.round(((price - discount?.discountPrice) / price) * 100)}% OFF
              </div>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="mb-2">
              <span className="inline-block bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full mb-2">
                {category}
              </span>
              <h3 className="text-xl font-bold group-hover:text-pink-500 transition-colors line-clamp-2 text-pink-400">
                {name}
              </h3>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
              {description}
            </p>
          </div>
        </Link>

        {/* Bottom Section */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            {discount?.isDiscounted ? (
              <>
                <div>
                  <span className="text-sm text-gray-400 line-through mr-2">
                    {price} TK
                  </span>
                  <span className="text-lg font-bold text-pink-500">
                    {discount?.discountPrice} TK
                  </span>
                </div>
                <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
                  Save {price - discount?.discountPrice} TK
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-pink-500">{price} TK</span>
            )}
          </div>

          <button
            onClick={handlePurchaseClick}
            className="w-full flex items-center justify-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
          >
            <FiEye className="w-4 h-4" />
            <span>Order Now</span>
          </button>
        </div>
      </div>

      {/* ✅ Purchase Modal */}
      <PurchaseModal
        refetch={refetch}
        cake={cake}
        isOpen={purchaseOpen}
        closeModal={closePurchaseModal}
        onSuccess={() => {
          // ✅ Order success হলে PurchaseModal auto close
          setPurchaseOpen(false);
          // ✅ তারপর success modal open
          setSuccessOpen(true);
        }}
      />

      {/* ✅ Success Modal (Parent এ রাখা হয়েছে তাই unmount হবে না) */}
      <ConfirmOrderModel
        isOpen={successOpen}
        closeModal={() => setSuccessOpen(false)}
        onContinue={() => {
          setSuccessOpen(false);

          if (sessionUser) {
            router.push(
              `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/customer/my-orders`,
            );
          } else {
            router.push(`${process.env.NEXT_PUBLIC_DOMAIN}`);
          }
        }}
      />
    </motion.div>
  );
};

export default Card;