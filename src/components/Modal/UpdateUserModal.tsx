"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  Listbox,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineDown } from "react-icons/ai";

const roles = ["Customer", "Seller", "Admin"];

const UpdateUserModal = ({ setIsOpen, isOpen, currentRole, updateRole, userName }: any) => {
  const [selected, setSelected] = useState(currentRole);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-10 text-left align-middle shadow-xl transition-all h-[280px]">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold text-center leading-6 text-gray-900"
                >
                  Update {userName}&apos;s Role
                </DialogTitle>
                <div className="mt-6">
                  <Listbox value={selected} onChange={setSelected}>
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-10 text-left text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2">
                        <span className="block truncate">{selected}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <AiOutlineDown
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </ListboxButton>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <ListboxOptions className="absolute mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black/5 max-h-60 overflow-auto py-2 sm:text-sm focus:outline-none z-10">
                          {roles.map((role, roleIdx) => (
                            <ListboxOption
                              key={roleIdx}
                              className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-pink-100"
                              value={role}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {role}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500">
                                      <BsCheckLg
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  )}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                  <button
                    onClick={() => updateRole(selected)}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-5 py-2.5 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
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

export default UpdateUserModal;
