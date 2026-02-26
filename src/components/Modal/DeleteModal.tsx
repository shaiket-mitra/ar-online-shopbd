import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Fragment } from 'react';

const DeleteModal = ({ closeModal, isOpen, handleDelete }: any) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
      <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
            <DialogPanel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl transform transition-all">
              {/* Title */}
              <DialogTitle as="h3" className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                ⚠️ Confirm Deletion
              </DialogTitle>

              {/* Message */}
              <p className="mt-3 text-sm text-gray-600">
                Are you sure you want to delete this? This action <span className="font-semibold text-red-500">cannot</span> be undone.
              </p>

              {/* Divider */}
              <hr className="my-4 border-gray-300" />

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handleDelete}
                  type="button"
                  className="w-1/2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition focus:ring-2 focus:ring-red-400 focus:outline-none"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 ml-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition focus:ring-2 focus:ring-gray-300 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteModal;
