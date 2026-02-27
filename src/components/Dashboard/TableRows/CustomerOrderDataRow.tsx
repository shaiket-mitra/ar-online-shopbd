"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiClock,
  FiTruck,
} from "react-icons/fi";
import DeleteModal from "../../Modal/DeleteModal";
import axios from "axios";
import Image from "next/image";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import OrderDetailsModal from "@/components/Modal/OrderDetailsModal";

const CustomerOrderDataRow = ({
  orderData,
  refetch,
  isLoading,
  index,
}: any) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { name, image, category, price, quantity, _id, status, productId } =
    orderData;

  const closeDeleteModal = () => setIsDeleteOpen(false);
  const closeDetailsModal = () => setIsDetailsOpen(false);

  const statusConfig: any = {
    Delivered: {
      color: "bg-green-100 text-green-800",
      icon: <FiCheck className="text-green-500" />,
    },
    "In Progress": {
      color: "bg-blue-100 text-blue-800",
      icon: <FiClock className="text-blue-500" />,
    },
    Pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <FiTruck className="text-yellow-500" />,
    },
  };

  const currentStatus = statusConfig[status] || statusConfig["Pending"];

  async function handleDelete() {
    try {
      await axios.delete(`/api/dashboard/delete-order/${_id}`);
      await axios.patch(`/api/dashboard/update-product-quentity/${productId}`, {
        quantityToUpdate: quantity,
        status: "increase",
      });
      refetch();
      toast.success("Order successfully canceled!", {
        icon: "✅",
        style: {
          background: "#4BB543",
          color: "#fff",
        },
      });
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to cancel order", {
        icon: "❌",
        style: {
          background: "#FF3333",
          color: "#fff",
        },
      });
    } finally {
      closeDeleteModal();
    }
  }

  return (
    <>
      <motion.tr
        onClick={() => setIsDetailsOpen(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        {/* Serial Number */}
        <td className="px-6 py-4 text-center text-gray-500 font-medium">
          {index + 1}
        </td>

        {/* Product Image */}
        <td className="px-6 py-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer"
          >
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100px, 150px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <FiX className="text-xl" />
              </div>
            )}
          </motion.div>
        </td>

        {/* Product Name */}
        <td className="px-6 py-4 font-medium text-gray-800">
          <span className="line-clamp-1">{name}</span>
        </td>

        {/* Category */}
        <td className="px-6 py-4 text-gray-600 capitalize">{category}</td>

        {/* Price */}
        <td className="px-6 py-4 font-semibold text-pink-600">
          ৳{price.toFixed(2)}
        </td>

        {/* Quantity */}
        <td className="px-6 py-4 text-center text-gray-700">{quantity}</td>

        {/* Status */}
        <td className="px-6 py-4">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}
          >
            {currentStatus.icon}
            <span className="ml-2">{status}</span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailsOpen(true);
              }}
              className="p-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
              aria-label="View details"
            >
              <FiEye className="w-5 h-5" />
            </motion.button>

            {status === "Pending" &&
              (isLoading ? (
                <LoadingSpinner />
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteOpen(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Cancel order"
                >
                  <FiTrash2 className="w-5 h-5" />
                </motion.button>
              ))}
            {/* Modals */}
            <DeleteModal
              isOpen={isDeleteOpen}
              closeModal={closeDeleteModal}
              handleDelete={handleDelete}
              title="Cancel Order"
              description="Are you sure you want to cancel this order? This action cannot be undone."
            />

            <OrderDetailsModal
              isOpen={isDetailsOpen}
              closeModal={closeDetailsModal}
              orderData={orderData}
            />
          </div>
        </td>
      </motion.tr>
    </>
  );
};

export default CustomerOrderDataRow;
