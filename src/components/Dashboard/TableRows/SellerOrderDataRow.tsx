"use client";

import { useState } from "react";
import DeleteModal from "@/components/Modal/DeleteModal";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEye, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import ViewProductDetails from "@/components/Modal/OrderDetailsModal";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const SellerOrderDataRow = ({ orderData, refetch, index }: any) => {
  // console.log(orderData.phone);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const closeDetailsModal = () => setIsDetailsOpen(false);

  async function handleStatus(newStatus: any) {
    if (orderData.status === newStatus) return;
    try {
      await axios.patch("/api/dashboard/seller/update-cake-status", {
        orderId: orderData?._id,
        orderStatus: newStatus,
      });
      refetch();
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to update status");
    }
  }

  async function handleDelete() {
    try {
      await axios.delete(`/api/dashboard/delete-order/${orderData?._id}`);
      await axios.patch(
        `/api/dashboard/update-cake-quentity/${orderData?.cakeId}`,
        {
          quantityToUpdate: orderData?.quantity,
          status: "increase",
        },
      );
      refetch();
      toast.success("Order cancelled successfully");
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to cancel order");
    } finally {
      closeModal();
    }
  }

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {index}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="flex items-center">
            {orderData?.image && (
              <div className="flex-shrink-0 h-10 w-10 mr-3 relative">
                <Image
                  src={orderData.image}
                  alt={orderData.name || "Product image"}
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 640px) 50px, 100px"
                />
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900">
                {orderData?.name || "Unknown"}
              </div>
              {/* <div className="text-gray-500 text-xs">
                #{orderData?._id?.slice(-6)}
              </div> */}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <div className="space-y-2">
            {/* Customer Name */}
            <div className="font-semibold text-gray-800 px-4">
              {orderData?.customer?.name || "N/A"}
            </div>

            {/* Phone Section */}
            <div>
              {(() => {
                const rawPhone = orderData?.phone || "";
                const formattedPhone = rawPhone
                  ? rawPhone.startsWith("+")
                    ? rawPhone
                    : `+880${rawPhone.replace(/^0/, "")}`
                  : "";

                return (
                  <a
                    href={formattedPhone ? `tel:${formattedPhone}` : undefined}
                    className={`inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium transition-all duration-200
              ${
                formattedPhone
                  ? "hover:bg-green-50 hover:text-green-600 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }`}
                    aria-disabled={!formattedPhone}
                    onClick={(e) => {
                      if (!formattedPhone) e.preventDefault();
                    }}
                    title={formattedPhone ? "Tap to call" : "No phone number"}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>

                    <span className="tracking-wide text-gray-700">
                      {formattedPhone || "No Phone"}
                    </span>
                  </a>
                );
              })()}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-500">
          ৳{orderData?.price?.toFixed(2) || "0.00"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {orderData?.quantity || "0"}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
          {orderData?.address || "Unknown"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusColors[orderData?.status as keyof typeof statusColors] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {orderData?.status || "Pending"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <select
              onChange={(e) => handleStatus(e.target.value)}
              value={orderData?.status}
              disabled={
                orderData.status === "Delivered" ||
                orderData.status === "Cancelled"
              }
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailsOpen(true);
              }}
              className="p-2 text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
              aria-label="View details"
            >
              <FiEye className="w-5 h-5" />
            </motion.button>
            <button
              onClick={() => setIsOpen(true)}
              disabled={orderData.status === "Delivered"}
              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Cancel Order"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
          <DeleteModal
            isOpen={isOpen}
            closeModal={closeModal}
            handleDelete={handleDelete}
            title="Cancel Order"
            description="Are you sure you want to cancel this order? This action cannot be undone."
          />
          <ViewProductDetails
            isOpen={isDetailsOpen}
            closeModal={closeDetailsModal}
            orderData={orderData}
          />
        </td>
      </tr>
    </>
  );
};

export default SellerOrderDataRow;
