"use client";

import { Dialog, Transition, TransitionChild, DialogTitle, DialogPanel } from '@headlessui/react';
import { Fragment } from 'react';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

interface BecomeSellerModalProps {
  closeModal: () => void;
  isOpen: boolean;
  requestHandler: () => void;
}

const BecomeSellerModal = ({ closeModal, isOpen, requestHandler }: BecomeSellerModalProps) => {
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
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 mb-4">
                    <FiAlertCircle className="h-6 w-6 text-pink-600" />
                  </div>
                  
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900"
                  >
                    Become A Seller
                  </DialogTitle>
                  
                  <div className="mt-4">
                    <p className="text-gray-600 mb-6">
                      Before becoming a seller, please review our terms and conditions carefully.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">Seller Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>Valid business documentation</li>
                        <li>Quality product standards</li>
                        <li>Timely order fulfillment</li>
                        <li>Customer service commitment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => {
                      requestHandler();
                      closeModal();
                    }}
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 transition-colors w-full sm:w-auto"
                  >
                    <FiCheckCircle className="mr-2 h-4 w-4" />
                    Confirm Request
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 transition-colors w-full sm:w-auto"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BecomeSellerModal;