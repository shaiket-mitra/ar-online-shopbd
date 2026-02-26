"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { FiCheckCircle, FiPhoneCall, FiX } from "react-icons/fi";
import Lottie from "lottie-react";
import balloonsAnimation from "@/assets/lottie/CelebrationsBegin.json";

interface ConfirmOrderModelProps {
  closeModal: () => void;
  isOpen: boolean;
  onContinue?: () => void;
}

const ConfirmOrderModel = ({
  closeModal,
  isOpen,
  onContinue,
}: ConfirmOrderModelProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white text-left shadow-2xl">
                {/* Top accent */}
                <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400" />

                {/* 🎈 Lottie Balloon Layer */}
                <div className="pointer-events-none absolute inset-0 z-[1]">
                  <Lottie
                    animationData={balloonsAnimation}
                    loop
                    autoplay
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>

                {/* Close */}
                {/* <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 z-[5] rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                  aria-label="Close"
                  type="button"
                >
                  <FiX className="h-5 w-5" />
                </button> */}

                {/* Content */}
                <div className="relative z-[5] p-6 sm:p-7">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                    <FiCheckCircle className="h-8 w-8 text-green-600" />
                  </div>

                  <DialogTitle
                    as="h3"
                    className="text-center text-2xl font-bold text-gray-900"
                  >
                    অভিনন্দন! 🎉
                  </DialogTitle>

                  <p className="mt-3 text-center text-gray-600 leading-relaxed">
                    আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।
                  </p>

                  <div className="mt-5 rounded-xl border bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-white p-2 shadow-sm">
                        <FiPhoneCall className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          অল্প সময়ের মধ্যেই আমাদের টিম আপনাকে কল করে অর্ডার
                          কনফার্ম করবে ।
                        </p>
                        {/* <p className="mt-1 text-sm text-gray-600">
                          অল্প সময়ের মধ্যেই আমাদের টিম আপনাকে কল করে অর্ডার
                          কনফার্ম করবে।
                        </p> */}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-center text-sm text-gray-500">
                    আমাদের সাথে থাকার জন্য ধন্যবাদ।
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => onContinue?.()}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                    >
                      ঠিক আছে
                    </button>

                    {/* <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition"
                    >
                      Close
                    </button> */}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmOrderModel;