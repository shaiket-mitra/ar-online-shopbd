"use client";

import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FiCheckCircle, FiInfo } from "react-icons/fi";
import Button from "../shared/Button";
import useAuth from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

type DeliveryArea = "inside" | "outside";

type PurchaseInfo = {
  customer: {
    name: string;
    email: string; // Guest allowed
    image?: string;
  };
  cakeId: string;
  seller?: string;
  address: string;
  phone: string;
  status: "Pending" | "Confirmed" | "Delivered" | string;
  createdAt: string;

  // order specifics
  deliveryArea: DeliveryArea;
};

const DELIVERY_CHARGE: Record<DeliveryArea, number> = {
  inside: 80,
  outside: 120,
};

const bdPhoneRegex = /^01[3-9]\d{8}$/;

const PurchaseModal = ({
  closeModal,
  isOpen,
  cake,
  refetch, // optional (আপনি চাইলে বাদ দিতে পারেন)
  onSuccess,
}: {
  closeModal: () => void;
  isOpen: boolean;
  cake: any;
  refetch?: any;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const { sessionUser } = useAuth();

  const { price, name, category, seller, quantity, _id, discount } = cake || {};

  // ===== Derived product price =====
  const unitPrice = useMemo(() => {
    return discount?.isDiscounted
      ? Number(discount?.discountPrice)
      : Number(price);
  }, [discount, price]);

  // ===== Form State =====
  const [loading, setLoading] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [phoneError, setPhoneError] = useState("");

  const [form, setForm] = useState<PurchaseInfo>({
    customer: {
      name: "",
      email: "Guest",
      image: "",
    },
    cakeId: _id,
    seller: seller?.email,
    address: "",
    phone: "",
    status: "Pending",
    createdAt: new Date().toISOString(),
    deliveryArea: "inside",
  });

  // ✅ only sync user data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setForm((prev) => ({
      ...prev,
      cakeId: _id,
      seller: seller?.email,
      createdAt: new Date().toISOString(),
      customer: {
        name: prev.customer.name || sessionUser?.name || "",
        email: sessionUser?.email || "Guest",
        image: sessionUser?.image || "",
      },
    }));

    setTotalQuantity(1);
    setPhoneError("");
  }, [
    _id,
    seller?.email,
    sessionUser?.name,
    sessionUser?.email,
    sessionUser?.image,
    isOpen,
  ]);

  // ===== Totals =====
  const subtotal = useMemo(
    () => unitPrice * totalQuantity,
    [unitPrice, totalQuantity],
  );

  const deliveryCharge = useMemo(
    () => DELIVERY_CHARGE[form.deliveryArea],
    [form.deliveryArea],
  );

  const grandTotal = useMemo(
    () => Number(subtotal) + Number(deliveryCharge),
    [subtotal, deliveryCharge],
  );

  // ===== Helpers =====
  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (!cleaned) {
      setPhoneError("Phone number is required");
      return false;
    }
    if (!bdPhoneRegex.test(cleaned)) {
      setPhoneError("সঠিক মোবাইল নাম্বার দিন (01XXXXXXXXX)");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleQuantity = (next: number) => {
    if (next > Number(quantity)) {
      toast.error("Quantity exceeds available stock");
      return setTotalQuantity(Number(quantity));
    }
    if (next < 1) {
      toast.error("Quantity can't be less than 1");
      return setTotalQuantity(1);
    }
    setTotalQuantity(next);
  };

  const handlePurchase = async () => {
    if (!form.customer.name.trim())
      return toast.error("Please provide your name");
    if (!validatePhone(form.phone)) return toast.error("Invalid phone number");
    if (!form.address.trim()) return toast.error("Please provide your address");

    try {
      setLoading(true);

      const orderData = {
        ...form,
        phone: form.phone.replace(/\D/g, ""),
        quantity: totalQuantity,
        price: subtotal, // subtotal
        deliveryCharge,
        totalAmount: grandTotal,
      };

      await axios.post("/api/order", orderData);

      await axios.patch(`/api/update-cake-quentity/${_id}`, {
        quantityToUpdate: totalQuantity,
        status: "decrease",
      });

      // ✅ UI update
      await queryClient.invalidateQueries({ queryKey: ["cakes"] });

      // optional: যদি refetch দরকার হয়
      if (typeof refetch === "function") {
        refetch();
      }

      // ✅ Parent কে জানান order success
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPhoneValid = bdPhoneRegex.test((form.phone || "").replace(/\D/g, ""));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-lg bg-white rounded-xl shadow-xl">
              <div className="p-6">
                <DialogTitle className="text-2xl font-bold text-center text-gray-900">
                  Complete Your Order
                </DialogTitle>

                <div className="mt-6 space-y-6 max-h-[65vh] overflow-y-auto pr-2">
                  {/* Customer info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      আপনার ইনফরমেশন দিন
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        আপনার নাম লিখুন *
                      </label>
                      <input
                        value={form.customer.name}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            customer: {
                              ...prev.customer,
                              name: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 outline-none bg-white"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        আপনার মোবাইল নাম্বার লিখুন *
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11);
                          setForm((prev) => ({ ...prev, phone: value }));
                          validatePhone(value);
                        }}
                        onBlur={() => validatePhone(form.phone)}
                        className={`w-full px-4 py-2 border rounded-lg outline-none bg-white ${
                          phoneError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="01XXXXXXXXX"
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                      />
                      {phoneError ? (
                        <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                      ) : form.phone ? (
                        <p className="text-xs text-green-600 mt-1">
                          Phone number looks valid
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        আপনার ঠিকানা লিখুন *
                      </label>
                      <input
                        value={form.address}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 outline-none bg-white"
                        placeholder="Your full address"
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                    <div className="flex">
                      <FiInfo className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">
                          Order Instructions
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          অর্ডার করা প্রোডাক্ট এর সাথে বাস্তবে মিল থাকা সত্বেও
                          ক্যান্সেল করলে অবশ্যই ডেলিভারি চার্জ দিয়ে ক্যান্সেল
                          করতে হবে ।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      ডেলিভারি এরিয়া নির্বাচন করুন *
                    </h4>

                    <div className="space-y-2">
                      <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="deliveryArea"
                          checked={form.deliveryArea === "inside"}
                          onChange={() =>
                            setForm((p) => ({ ...p, deliveryArea: "inside" }))
                          }
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            ঢাকার সিটির ভিতরে
                          </p>
                          <p className="text-xs text-gray-500">
                            ডেলিভারি চার্জ ৳{DELIVERY_CHARGE.inside}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ৳{DELIVERY_CHARGE.inside}
                        </p>
                      </label>

                      <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="deliveryArea"
                          checked={form.deliveryArea === "outside"}
                          onChange={() =>
                            setForm((p) => ({ ...p, deliveryArea: "outside" }))
                          }
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            ঢাকার সিটির বাইরে
                          </p>
                          <p className="text-xs text-gray-500">
                            ডেলিভারি চার্জ ৳{DELIVERY_CHARGE.outside}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ৳{DELIVERY_CHARGE.outside}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Order summary */}
                  <div className="rounded-xl border bg-white p-4">
                    <h4 className="font-semibold text-gray-900">অর্ডার সামারি</h4>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-600">পণ্যের নাম</span>
                        <span className="font-medium text-gray-900 text-right">
                          {name}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-600">ক্যাটেগরি</span>
                        <span className="capitalize text-gray-900 text-right">
                          {category}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-600">ইউনিট মূল্য</span>
                        <span className="text-right font-semibold text-gray-900">
                          ৳{unitPrice}
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-4">
                        <span className="text-gray-600">পণ্যের পরিমাণ</span>
                        <span className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuantity(totalQuantity - 1)}
                            disabled={totalQuantity <= 1}
                            className="h-8 w-8 rounded-full border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                          >
                            -
                          </button>

                          <span className="min-w-[36px] text-center text-sm font-semibold text-gray-900">
                            {totalQuantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleQuantity(totalQuantity + 1)}
                            disabled={totalQuantity >= Number(quantity)}
                            className="h-8 w-8 rounded-full border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-600">স্টকে আছে</span>
                        <span className="text-gray-900 text-right">
                          {quantity} units
                        </span>
                      </div>

                      <div className="my-2 border-t" />

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-semibold text-gray-900">
                          ৳{subtotal}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-700">Delivery</span>
                        <span className="font-semibold text-gray-900">
                          ৳{deliveryCharge}
                        </span>
                      </div>

                      <div className="mt-2 rounded-lg bg-gray-50 py-2 border-t-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">
                            Grand Total
                          </span>
                          <span className="font-bold text-gray-900">
                            ৳{grandTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-between gap-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    type="button"
                  >
                    Cancel
                  </button>

                  <Button
                    onClick={handlePurchase}
                    label={
                      <div className="flex items-center gap-2 justify-center">
                        {loading ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <FiCheckCircle className="w-5 h-5" />
                            <span>Place Order (৳{grandTotal})</span>
                          </>
                        )}
                      </div>
                    }
                    loading={loading}
                    disabled={
                      loading ||
                      totalQuantity <= 0 ||
                      !form.customer.name.trim() ||
                      !form.address.trim() ||
                      !form.phone.trim() ||
                      !isPhoneValid ||
                      !!phoneError
                    }
                    className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PurchaseModal;