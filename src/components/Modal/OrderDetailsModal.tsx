import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import {
  FiCheck,
  FiClock,
  FiTruck,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import { Phone } from "lucide-react";

interface OrderData {
  _id: string;
  name: string;
  image?: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  cakeId: string;
  customer: {
    name: string;
    email: string;
  };
  address: string;
  phone: string;
  paymentProof?: string;
  createdAt: string;
}

const ViewProductDetails = ({
  closeModal,
  isOpen,
  orderData,
}: {
  closeModal: () => void;
  isOpen: boolean;
  orderData: OrderData;
}) => {
  const {
    name,
    image,
    category,
    price,
    quantity,
    status,
    customer,
    address,
    phone,
    paymentProof,
    createdAt,
  } = orderData;

  const orderDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const perUnitPrice = price / quantity;

  const statusConfig = {
    Delivered: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: <FiCheck className="text-green-500" />,
      label: "Delivered",
    },
    "In Progress": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <FiClock className="text-blue-500" />,
      label: "In Progress",
    },
    Pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <FiTruck className="text-amber-500" />,
      label: "Pending",
    },
  };

  const currentStatus =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig["Pending"];

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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={closeModal}
                  >
                    <span className="sr-only">Close</span>
                    <FiX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold leading-7 text-gray-900 border-b pb-4"
                >
                  Order Details
                </DialogTitle>

                <div className="mt-6 space-y-6">
                  {/* Product Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      PRODUCT
                    </h4>
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-white">
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
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{name}</h4>
                        <p className="text-sm text-gray-600 capitalize mt-1">
                          {category}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            ৳{perUnitPrice.toFixed(2)} × {quantity}
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            ৳{(perUnitPrice * quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      ORDER STATUS
                    </h4>
                    <div className="flex items-center justify-between gap-2 flex-col sm:flex-row">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${currentStatus.color}`}
                        >
                          {currentStatus.icon}
                          <span className="font-medium">
                            {currentStatus.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiCalendar className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        <span>{orderDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      CUSTOMER INFORMATION
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiUser className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{customer.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FiMail className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{customer.email}</span>
                      </div>
                      {/* <div className="flex items-center">
                        <FiPhone className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{phone}</span>
                      </div> */}
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
                              href={
                                formattedPhone
                                  ? `tel:${formattedPhone}`
                                  : undefined
                              }
                              className={`inline-flex items-center gap-2 rounded-lg bg-gray-50 py-2 text-sm font-medium transition-all duration-200
                                    ${
                                      formattedPhone
                                        ? "bg-green-50 text-green-600 cursor-pointer"
                                        : "opacity-60 cursor-not-allowed"
                                    }`}
                              aria-disabled={!formattedPhone}
                              onClick={(e) => {
                                if (!formattedPhone) e.preventDefault();
                              }}
                              title={
                                formattedPhone
                                  ? "Tap to call"
                                  : "No phone number"
                              }
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
                      <div className="flex items-start">
                        <FiMapPin className="mr-2 h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">{address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  {paymentProof && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        PAYMENT PROOF
                      </h4>
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2 h-5 w-5 text-gray-400" />
                        <a
                          href={paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          View Payment Receipt
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors"
                    onClick={closeModal}
                  >
                    Close Details
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

export default ViewProductDetails;
