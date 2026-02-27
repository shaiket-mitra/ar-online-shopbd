"use client";

import { useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
import { FiUpload, FiDollarSign, FiPackage, FiTag, FiInfo } from "react-icons/fi";
import Image from "next/image";

interface AddProductFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  uploadButtonText: string;
  setUploadButtonText: (text: string) => void;
  loading: boolean;
}

const WATCH_CATEGORIES = [
  { value: "new-arrival", label: "New Arrival" },
  { value: "best-selling", label: "Best Selling" },
  { value: "limited-edition", label: "Limited Edition" },
  { value: "couple-watch", label: "Couple Watch" },
  { value: "gift-collection", label: "Gift Collection" },
  { value: "eid-special-offer", label: "Eid Special Offer" },
];

const AddProductForm = ({
  handleSubmit,
  uploadButtonText,
  setUploadButtonText,
  loading,
}: AddProductFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDiscounted, setIsDiscounted] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const shortName =
        file.name.length > 25
          ? `${file.name.substring(0, 10)}...${file.name.substring(file.name.length - 10)}`
          : file.name;

      setUploadButtonText(shortName);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 py-6 px-8">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center">
              <FiPackage className="mr-3" />
              Add New Product
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <FiTag className="mr-2 text-pink-500" />
                    Product Name
                  </label>
                  <input
                    className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 bg-white"
                    name="name"
                    id="name"
                    type="text"
                    placeholder="e.g. Naviforce NF 9182 Men's Watch"
                    required
                  />
                </div>

                {/* ✅ Category Field (UPDATED) */}
                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <FiTag className="mr-2 text-pink-500" />
                    Category
                  </label>

                  <select
                    required
                    className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 bg-white"
                    name="category"
                    id="category"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a category
                    </option>

                    {WATCH_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <p className="text-xs text-gray-500">
                    Tip: Choose the collection where you want this watch to appear.
                  </p>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <FiInfo className="mr-2 text-pink-500" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Describe the watch (brand, model, movement, warranty, features, water resistance)..."
                    className="block w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 bg-white"
                    name="description"
                    rows={5}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Price & Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="text-sm font-medium text-gray-700 flex items-center"
                    >
                      <FiDollarSign className="mr-2 text-pink-500" />
                      Price (৳)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">৳</span>
                      </div>
                      <input
                        className="bg-white block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        name="price"
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity
                    </label>
                    <input
                      className="bg-white block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      name="quantity"
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="Available stock"
                      required
                    />
                  </div>
                </div>

                {/* Discount Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="addDiscount"
                      name="addDiscount"
                      className="h-4 w-4 appearance-none border border-gray-300 rounded bg-white checked:bg-pink-500 checked:border-pink-500 focus:ring-pink-500"
                      onChange={(e) => setIsDiscounted(e.target.checked)}
                    />
                    <label htmlFor="addDiscount" className="ml-2 block text-sm text-gray-700">
                      Add discount
                    </label>
                  </div>

                  {isDiscounted && (
                    <div className="space-y-2 pl-6">
                      <label
                        htmlFor="discountPrice"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Discount Price (৳)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">৳</span>
                        </div>
                        <input
                          className="bg-white block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                          name="discountPrice"
                          id="discountPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-3 text-pink-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        {uploadButtonText || "PNG, JPG (MAX. 5MB)"}
                      </p>
                    </div>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      required
                    />
                  </label>

                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={imagePreview}
                          alt="Product preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <TbFidgetSpinner className="animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    "Add a New Product"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;