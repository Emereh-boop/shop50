import React, { useEffect, useState } from "react";
import { useCart } from "../context/cart/context";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Plus } from "react-bootstrap-icons";
import { XMarkIcon, MinusIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/format";
import { useAuth } from "../context/auth/context";

export default function Cart() {
  const [open, setOpen] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const {
    cartItems = [],
    removeItem,
    updateQuantity,
  } = useCart();
  const { user } = useAuth();

  const cart = cartItems.reduce(
    (acc, item) => {
      const existingItem = acc.cart.find((cartItem) => cartItem.id === item.id);
      if (!existingItem) {
        acc.cart.push({ ...item, qty: item.quantity });
      } else {
        existingItem.qty += item.quantity;
      }
      return acc;
    },
    { cart: [] }
  ).cart;

  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + Number(item.qty) * Number(item.price),
      0
    );
    setSubTotal(total);
  }, [cart]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-100">
                            {cart.length === 0 ? (
                              <p>Your cart is empty</p>
                            ) : (
                              cart.map((product, index) => (
                                <li
                                  key={product.id + index}
                                  className="flex py-6"
                                >
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-100">
                                    <img
                                      src={product.imageUrl}
                                      alt={product.title}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{product.title}</h3>
                                        <p className="ml-4">
                                          {formatCurrency(product.price)}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.color}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <button
                                          className="rounded-full p-1 bg-primary"
                                          onClick={() =>
                                            updateQuantity(
                                              product.id,
                                              product.qty - 1
                                            )
                                          }
                                        >
                                          <MinusIcon className="h-4 w-4 text-white" />
                                        </button>
                                        <p className="text-gray-400 text-center">
                                          {product.qty}
                                        </p>
                                        <button
                                          className="rounded-full p-1 bg-primary"
                                          onClick={() =>
                                            updateQuantity(
                                              product.id,
                                              product.qty + 1
                                            )
                                          }
                                        >
                                          <Plus className="h-4 w-4 text-white" />
                                        </button>
                                      </div>
                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-neutral-600 hover:text-neutral-500"
                                          onClick={() => removeItem(product.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{formatCurrency(subTotal)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <a
                          href={`/checkout/${user?.uid}`}
                          className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/80"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="font-medium text-primary hover:text-primary/80"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
