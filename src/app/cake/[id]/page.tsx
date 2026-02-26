"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingCart, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Heading from "@/components/shared/Heading";
import Button from "@/components/shared/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import PurchaseModal from "@/components/Modal/PurchaseModal";
import ConfirmOrderModel from "@/components/Modal/ConfirmOrderModel";
import useAuth from "@/hooks/useAuth";

const CakeDetails = () => {
  const router = useRouter();
  const { sessionUser } = useAuth();
  const { id } = useParams();

  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const {
    data: cake = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cake", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/get-single-cake/${id}`);
      return data;
    },
  });

  const closePurchaseModal = () => setPurchaseOpen(false);

  if (isLoading) return <LoadingSpinner />;

  const { category, description, image, price, name, seller, quantity, discount } =
    cake || {};

  const handlePurchaseClick = () => {
    setPurchaseOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-pink-500 hover:text-pink-600 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to Cakes
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[70vh]"
      >
        {/* Cake Image */}
        <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover w-full h-full"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          />
          {discount?.isDiscounted && (
            <div className="absolute top-4 right-4 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
              {Math.round(((price - discount?.discountPrice) / price) * 100)}%
              OFF
            </div>
          )}
        </div>

        {/* Cake Details */}
        <div className="lg:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="flex-1">
            <div className="mb-4">
              <span className="inline-block bg-pink-100 text-pink-600 text-xs px-3 py-1 rounded-full mb-3">
                {category}
              </span>
              <Heading title={name} center={false} />
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>

            {/* Seller Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-8">
              <div className="relative h-12 w-12 min-w-[48px]">
                <Image
                  className="rounded-full object-cover"
                  fill
                  alt="Seller Avatar"
                  referrerPolicy="no-referrer"
                  src={seller?.image}
                  sizes="48px"
                />
              </div>
              <div>
                <p className="font-medium">Sold by {seller?.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiCheckCircle className="text-green-500 mr-1" />
                  Verified Seller
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Action */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                {discount?.isDiscounted ? (
                  <>
                    <span className="text-2xl font-bold text-pink-500">
                      {discount?.discountPrice} TK
                    </span>
                    <span className="text-lg text-gray-400 line-through ml-2">
                      {price} TK
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    {price} TK
                  </span>
                )}
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quantity > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {quantity > 0 ? `${quantity} Available` : "Out of Stock"}
              </span>
            </div>

            <Button
              onClick={handlePurchaseClick}
              label={
                <div className="flex items-center justify-center">
                  <FiShoppingCart className="mr-2" />
                  {quantity > 0 ? "Purchase Now" : "Notify Me"}
                </div>
              }
              disabled={quantity <= 0}
              className="w-full py-3 text-lg hover:shadow-md transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* ✅ Purchase Modal */}
      <PurchaseModal
        refetch={refetch}
        cake={cake}
        closeModal={closePurchaseModal}
        isOpen={purchaseOpen}
        onSuccess={() => {
          // ✅ order success হলে purchase modal auto close
          setPurchaseOpen(false);
          // ✅ success modal open
          setSuccessOpen(true);
        }}
      />

      {/* ✅ Success Modal */}
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
    </div>
  );
};

export default CakeDetails;