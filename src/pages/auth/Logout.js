import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/auth/context";

export default function Logout({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const cancelButtonRef = useRef(null);
  const [success, setSuccess] = useState(false);

  const handleLogout = () => {
    logout();
    setSuccess(true);

    // Close modal after showing success message
    setTimeout(() => {
      setSuccess(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full justify-center md:p-4 text-center items-center p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  {success ? (
                    // Success Message
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircleIcon className="h-12 w-12 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900 mt-3">Logout Successful</h3>
                      <p className="text-sm text-gray-500 mt-2">You have been logged out.</p>
                    </div>
                  ) : (
                    // Logout Confirmation
                    <div className="sm:flex sm:items-start justify-center">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Logout
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to logout of your account?
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex self-center items-center justify-center sm:flex-row-reverse sm:px-6">
                  {!success && (
                    <>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-sm bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-sm bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 hover:bg-gray-100 sm:mt-0 sm:w-auto"
                        ref={cancelButtonRef}
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
