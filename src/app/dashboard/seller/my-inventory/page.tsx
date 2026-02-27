"use client";

import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import DeleteModal from "@/components/Modal/DeleteModal";
import toast from "react-hot-toast";
import ProductDataRow from "@/components/Dashboard/TableRows/ProductDataRow";
import UpdateProductModal from "@/components/Modal/UpdateProductModal";

const ITEMS_PER_PAGE = 10;

const MyInventory = () => {
  const { sessionUser } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalType, setModalType] = useState<"delete" | "edit" | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Fetch cakes data
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ["products", sessionUser?.email],
    queryFn: async () => {
      if (!sessionUser?.email) return [];
      try {
        const { data } = await axios.get(
          `/api/dashboard/seller/get-my-products/${sessionUser.email}`
        );
        return data;
      } catch (error) {
        toast.error("Failed to fetch products");
        return [];
      }
    },
    enabled: !!sessionUser?.email,
  });

  // Filter and pagination logic
  const filteredProducts = products.filter((product: any) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Delete cake handler
  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      setIsLoadingAction(true);
      await axios.delete(`/api/dashboard/seller/delete-product/${selectedProduct._id}`);
      toast.success("Product deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsLoadingAction(false);
      setModalType(null);
      setSelectedProduct(null);
    }
  };

  // Update cake handler
const handleUpdate = async (productData: any) => {
  if (!selectedProduct) return;
  
  try {
    setIsLoadingAction(true);
    // console.log("selectedCake._id", selectedCake._id)
    const { data } = await axios.put(
      `/api/dashboard/seller/update-singleProduct/${selectedProduct._id}`,
      productData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (data.success) {
      toast.success(data.message || "Product updated successfully");
      refetch();
      setModalType(null);
      setSelectedProduct(null);
    } else {
      toast.error(data.message || "Failed to update product");
    }
  } catch (error: any) {
    console.error("Update error:", error);
    toast.error(error.response?.data?.message || "Failed to update product");
  } finally {
    setIsLoadingAction(false);
  }
};

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              My Product Inventory
            </h2>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full bg-white"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button
                onClick={() => router.push("/dashboard/seller/add-product")}
                className="flex items-center justify-center px-4 py-2 bg-white text-pink-600 rounded-lg shadow hover:bg-gray-50 transition-colors"
              >
                <FiPlus className="mr-2" />
                Add New Product
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product: any, index: number) => (
                  <ProductDataRow
                    key={product._id} 
                    product={product} 
                    index={startIndex + index + 1}
                    onEdit={() => {
                      setSelectedProduct(product);
                      setModalType("edit");
                    }}
                    onDelete={() => {
                      setSelectedProduct(product);
                      setModalType("delete");
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? "No matching products found" : "Your inventory is empty"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}
              </span>{' '}
              of <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md border ${currentPage === pageNum ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={modalType === "delete"}
        closeModal={() => {
          setModalType(null);
          setSelectedProduct(null);
        }}
        handleDelete={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product ? This action cannot be undone."
        isLoading={isLoadingAction}
      />

      {/* Update Modal */}
      <UpdateProductModal
        product={selectedProduct}
        isOpen={modalType === "edit"}
        closeModal={() => {
          setModalType(null);
          setSelectedProduct(null);
        }}
        handleProductUpdate={handleUpdate}
        isLoading={isLoadingAction}
      />
    </div>
  );
};

export default MyInventory;