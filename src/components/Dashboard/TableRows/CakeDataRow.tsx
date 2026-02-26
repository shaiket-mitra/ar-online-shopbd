"use client";

import { FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";
import Image from "next/image";

const CakeDataRow = ({
  cake,
  index,
  onEdit,
  onDelete,
}: {
  cake: any;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { image, name, category, price, quantity } = cake || {};

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-gray-50 transition-colors"
    >
      {/* Serial Number */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {index}
      </td>

      {/* Product */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden border border-gray-200">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={48}
                height={48}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                <FiImage className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{name}</div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 capitalize">{category}</div>
      </td>

      {/* Price */}
      <td className="px-6 py-4 whitespace-nowrap">
        {/* <div className="text-sm font-semibold text-pink-600">৳{price}</div> */}
        <div className="">
          {cake.discount?.isDiscounted ? (
            <>
              <span className="font-semibold text-sm text-pink-600">
                {cake.discount?.discountPrice} TK
              </span>
              <span className="font-semibold text-sm text-gray-800 line-through ml-2">
                {price} TK
              </span>
            </>
          ) : (
            <span className="font-semibold text-sm text-pink-600">{price} TK</span>
          )}
        </div>
      </td>

      {/* Stock */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            quantity > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {quantity} in stock
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-900"
          >
            <FiEdit2 className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
          >
            <FiTrash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default CakeDataRow;
