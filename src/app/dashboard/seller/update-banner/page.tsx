"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { TbFidgetSpinner, TbTrash, TbX } from "react-icons/tb";
import { FiUpload, FiLink, FiImage, FiPackage } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { imageUpload } from "@/lib/imageUpload";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface ISlider {
  _id: string;
  imgSrc: string;
  productLink: string;
  createdAt: string;
}

/* ----------------------- API helpers ----------------------- */
const readSliders = async (): Promise<ISlider[]> => {
  const { data } = await axios.get("/api/sliders/read");
  if (!data?.success || !Array.isArray(data?.sliders)) return [];
  return data.sliders;
};

const createSlider = async (payload: { file: File; productLink: string }) => {
  const uploaded = await imageUpload(payload.file);
  if (!uploaded) throw new Error("Image upload failed");

  const { data } = await axios.post("/api/sliders/create", {
    imgSrc: uploaded,
    productLink: payload.productLink,
  });

  if (!data?.success) throw new Error(data?.message || "Failed to create banner");
  return data.slider as ISlider;
};

const deleteSlider = async (id: string) => {
  await axios.delete(`/api/sliders/delete/${id}`);
  return id;
};

/* ----------------------- Component ----------------------- */
const BannersPage = () => {
  const qc = useQueryClient();

  // Upload form state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [productLink, setProductLink] = useState("");

  // file input ref (so clicking preview triggers upload)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Local preview url
  useEffect(() => {
    const url = file ? URL.createObjectURL(file) : "";
    setPreview(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  /* ----------------------- READ ----------------------- */
  const {
    data: sliders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sliders"],
    queryFn: readSliders,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: (prev) => prev,
  });

  /* ----------------------- DELETE (optimistic) ----------------------- */
  const delMutation = useMutation({
    mutationFn: deleteSlider,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["sliders"] });
      const previous = qc.getQueryData<ISlider[]>(["sliders"]);
      qc.setQueryData<ISlider[]>(["sliders"], (old) =>
        (old ?? []).filter((s) => s._id !== id)
      );
      return { previous };
    },
    onError: (err: any, _id, ctx) => {
      qc.setQueryData(["sliders"], ctx?.previous);
      toast.error(err?.response?.data?.message || err?.message || "Delete failed");
    },
    onSuccess: () => toast.success("Deleted"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["sliders"] }),
  });

  /* ----------------------- CREATE (prepend + sync) ----------------------- */
  const createMutation = useMutation({
    mutationFn: createSlider,
    onSuccess: (newSlider) => {
      toast.success("Banner uploaded");
      setFile(null);
      setPreview("");
      setProductLink("");

      // instant prepend
      qc.setQueryData<ISlider[]>(["sliders"], (old) => [newSlider, ...(old ?? [])]);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Upload failed");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["sliders"] }),
  });

  const onDelete = useCallback(
    (id: string) => {
      const ok = confirm("Delete this banner?");
      if (!ok) return;
      delMutation.mutate(id);
    },
    [delMutation]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Banner image is required");
    if (!productLink) return toast.error("Product link is required");
    createMutation.mutate({ file, productLink });
  };

  const openFilePicker = () => {
    if (!fileInputRef.current) return;
    // allow selecting same file again
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const listContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="py-10">
          <LoadingSpinner />
          <p className="text-center text-gray-500 mt-3">Loading Banner...</p>
        </div>
      );
    }

    if (isError) {
      const message =
        error instanceof Error
          ? error.message
          : (error as any)?.message || "Failed to load banners";
      return <p className="text-sm text-red-600">{message}</p>;
    }

    if (!sliders.length) {
      return <p className="text-sm text-gray-600">No banners yet. Add one below.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sliders.map((s) => (
          <div
            key={s._id}
            className="relative group rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="relative w-full aspect-[16/6] bg-gradient-to-br from-[#f8f8f8] to-[#eef7f5]">
              <Image src={s.imgSrc} alt="banner" fill className="object-contain" />
            </div>

            <div className="p-4 flex items-center justify-between gap-3">
              <a
                href={s.productLink}
                target="_blank"
                className="text-sm text-pink-600 hover:underline truncate"
                title={s.productLink}
              >
                {s.productLink}
              </a>

              <button
                onClick={() => onDelete(s._id)}
                className="bg-white text-red-500 rounded-full p-2 border shadow hover:bg-red-50"
                title="Delete"
              >
                <TbTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [isLoading, isError, error, sliders, onDelete]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header like AddProductForm */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 py-6 px-8">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center">
              <FiPackage className="mr-3" />
              Banner Manager
            </h2>
          </div>

          <div className="p-8 space-y-10">
            {/* Existing banners */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiImage className="mr-2 text-pink-500" />
                Existing Banners
              </h3>
              {listContent}
            </section>

            {/* Add new banner */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiUpload className="mr-2 text-pink-500" />
                Add New Banner
              </h3>

              <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Upload / Preview clickable */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Banner Image
                  </label>

                  {/* Hidden input controlled by ref */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e: any) => {
                      const f = e.target.files?.[0];
                      if (f) setFile(f);
                    }}
                    required={!file} // required only if no file yet
                  />

                  {/* If preview exists: show preview only (clickable to change) */}
                  {preview ? (
                    <div className="space-y-2 ">
                      <button
                        type="button"
                        onClick={openFilePicker}
                        className="relative w-full aspect-[16/6] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 focus:outline-none group"
                        title="Click to change banner image"
                      >
                        <Image
                          src={preview}
                          alt="preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition text-white text-sm font-semibold">
                            Click to change
                          </span>
                        </div>

                        {/* Remove button */}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                          className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-2 shadow hover:bg-red-50 cursor-pointer"
                          title="Remove"
                        >
                          <TbX size={18} />
                        </span>
                      </button>

                      <p className="text-xs text-gray-500">
                        Click the preview image to select another banner.
                      </p>
                    </div>
                  ) : (
                    // If no preview: show upload box
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="flex flex-col items-center justify-center w-full aspect-[16/6] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                      title="Click to upload banner"
                    >
                      <FiUpload className="w-8 h-8 mb-3 text-pink-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (Best: 16:6)</p>
                    </button>
                  )}
                </div>

                {/* Right: Link + Button */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="plink"
                      className="text-sm font-medium text-gray-700 flex items-center"
                    >
                      <FiLink className="mr-2 text-pink-500" />
                      Product Link
                    </label>
                    <input
                      id="plink"
                      type="url"
                      placeholder="https://example.com/product/123"
                      value={productLink}
                      onChange={(e) => setProductLink(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full mt-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <TbFidgetSpinner className="animate-spin mr-2" />
                        Processing...
                      </span>
                    ) : (
                      "Add New Banner"
                    )}
                  </button>

                  <p className="text-xs text-gray-500">
                    Tip: Use wide banner image (16:6) for better fit.
                  </p>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannersPage;