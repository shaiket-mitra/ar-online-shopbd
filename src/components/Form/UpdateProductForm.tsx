// components/Modal/UpdateCakeForm.tsx
"use client";

import { imageUpload } from "@/lib/imageUpload";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

const UpdateProductForm = ({
  product,
  handleProductUpdate,
  loading,
  closeModal,
}: {
  product: any;
  handleProductUpdate: (data: any) => Promise<void>;
  loading: boolean;
  closeModal: () => void;
}) => {
  const { image, name, category, price, quantity, description } = product || {};
  const [previewImage, setPreviewImage] = useState(image);
  const [imageError, setImageError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file (JPEG, PNG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      setImageError("Image size must be less than 5MB");
      return;
    }

    setImageError("");
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Handle image upload
      const imageFile = formData.get("image") as File;
      let imageUrl = image;

      if (imageFile?.size > 0) {
        try {
          imageUrl = await imageUpload(imageFile);
        } catch (err) {
          toast.error("Failed to upload image");
          return;
        }
      }

      // Prepare data with proper types
      const productData = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        discountPrice: Number(formData.get("discountPrice")),
        quantity: Number(formData.get("quantity")),
        image: imageUrl,
      };

      // Validate
      if (!productData.name.trim() || !productData.category.trim()) {
        toast.error("Name and category are required");
        return;
      }

      if (isNaN(productData.price) || productData.price <= 0) {
        toast.error("Price must be a positive number");
        return;
      }

      if (isNaN(productData.quantity) || productData.quantity < 0) {
        toast.error("Quantity must be 0 or more");
        return;
      }

      await handleProductUpdate(productData);
      closeModal();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center bg-white p-2 rounded-xl">
      <form className="w-full" onSubmit={handleSubmit}>
        {/* ... rest of your form fields remain the same ... */}
        <div className="grid grid-cols-1 gap-6">
          {/* Existing form fields remain the same */}
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Product Name
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              name="name"
              id="name"
              type="text"
              placeholder="Enter product name..."
              required
              defaultValue={name}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium"
            >
              🏷️ Category
            </label>
            <select
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              name="category"
              defaultValue={category}
            >
              <option value="Anniversary">Anniversary</option>
              <option value="Birthday">Birthday</option>
              <option value="Chocolate">Chocolate</option>
              <option value="CupProducts">CupProduct</option>
              <option value="Wedding">Wedding</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium"
            >
              📝 Description
            </label>
            <textarea
              id="description"
              placeholder="Write product description here..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              name="description"
              defaultValue={description}
            ></textarea>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-gray-700 font-medium"
              >
                💲 Price
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                name="price"
                defaultValue={price}
                id="price"
                type="number"
                placeholder="Enter price"
                required
              />
            </div>

            {product?.discount?.isDiscounted && (
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
                    defaultValue={product?.discount?.discountPrice}
                  />
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label
                htmlFor="quantity"
                className="block text-gray-700 font-medium"
              >
                📦 Quantity
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                name="quantity"
                id="quantity"
                type="number"
                placeholder="Available quantity"
                required
                defaultValue={quantity}
              />
            </div>
          </div>

          {/* Image Upload + Preview */}
          <div className="flex flex-col items-center border border-gray-300 rounded-md p-4 space-y-4">
            <label className="block text-gray-700 font-medium">
              📸 Upload Image
            </label>

            {previewImage && (
              <Image
                src={previewImage}
                alt="Product Preview"
                className="w-56 h-40 object-cover rounded-md border"
                width={200}
                height={200}
              />
            )}

            <label className="cursor-pointer bg-pink-400 text-white px-4 py-2 rounded-md hover:bg-pink-500 transition">
              Choose File
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>
          {/* Button group */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-pink-400 text-white rounded-md shadow-md hover:bg-pink-500 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
