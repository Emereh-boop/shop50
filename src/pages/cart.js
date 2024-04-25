import React, { useContext } from "react";
import ShopContext from "../context/cart/shop-context";
import Navbar from "../components/Navbar";

// export default function Cart() {
//   const [quantity, setQuantity] = React.useState(0);

//   const handleBack = () => {
//     window.location.href = "/";
//   };

//   return (
//     <div className="px-4 md:px-20 py-10 flex flex-col justify-between h-svh text-xs text-gray-600 ">
//       <Navbar />
//       <div className="flex flex-col gap-3 md:gap-4">
//         <div className="flex flex-col md:flex-row justify-between gap-4">
//           <div className="flex md:w-3/4 flex-col gap-3">
//             <h1 className=" font-bold text-8xl text-black ">CART</h1>
//             {cartItem.length === 0 ? (
//               <div className="flex flex-col align-middle">
//                 <h1 className="text-7xl text-black text-center">
//                   {" "}
//                   CART IS EMPTY{" "}
//                 </h1>
//                 <button className=" underline hover:text-blue-500 text-xl p-2  rounded-sm">
//                   {" "}
//                   click to add items
//                 </button>
//               </div>
//             ) : (
//               cartItem.map((p, index) => {
//                 return (
//                   <ol key={p.key + index}>
//                     <div className="flex flex-col md:flex-row">
//                       <div className="md:flex md:w-11/12 grid grid-cols-2 md:gap-12">
//                         <img
//                           className="object-contain w-28 md:w-40"
//                           src={p.item.image}
//                           alt=""
//                         />
//                         <div className="flex flex-col gap-2">
//                           <h3 className="font-bold text-black text-xl">
//                             {p.item.title}
//                           </h3>
//                           <p>COLOR WHITE</p>
//                           <p>
//                             {p.item.availability ? "IN STOCK" : "OUT OF STOCK"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex justify-between md:w-3/5">
//                         <div className="md:w-1/4 flex flex-col gap-10">
//                           <select className="md:w-16 outline-none">
//                             <option disabled>SIZE</option>
//                             {p.item.sizes.map((size) => {
//                               return <option key={size}>{size}</option>;
//                             })}
//                           </select>
//                         </div>
//                         <div className="md:w-1/4 flex flex-col gap-10">
//                           <label htmlFor="select">QUANTITY</label>
//                           <div className="flex justify-between cursor-pointer">
//                             <button
//                               onClick={() => {
//                                 setQuantity((prev) => prev - 1);
//                               }}
//                             >
//                               -
//                             </button>
//                             <div className="text-sm font-bold">{quantity}</div>
//                             <button
//                               onClick={() => {
//                                 setQuantity((prev) => prev + 1);
//                               }}
//                             >
//                               +
//                             </button>
//                           </div>
//                         </div>
//                         <div className="md:w-1/4 flex flex-col gap-10">
//                           <label htmlFor="select">PRICE</label>
//                           <div className="md:w-1/3 text-black font-bold">
//                             {quantity === 0
//                               ? calculateDiscount(
//                                   p.item.prevprice,
//                                   p.item.discount
//                                 )
//                               : calculateDiscount(
//                                   p.item.prevprice,
//                                   p.item.discount
//                                 ) * quantity}
//                           </div>
//                         </div>
//                       </div>
//                       <div
//                         onClick={() => removeItem(p.key)}
//                         className="flex flex-col h-1/2 w-1/12 justify-center text-2xl"
//                       >
//                         <img className="h-6 w-6" src={cancelIcon} alt="" />
//                       </div>
//                     </div>
//                   </ol>
//                 );
//               })
//             )}
//           </div>
//           <div className="md:w-1/4 h-1/2 justify-end flex flex-col gap-4">
//             <h2 className="font-bold text-black text-4xl">SUMMARY</h2>
//             <div className="flex justify-between text-black font-bold">
//             <div className="flex-grow border-t border-black"></div>
//               <p>
//                 <strong>TOTAL PRODUCTS </strong>
//               </p>
//               <strong>{cartItem.length}</strong>
//             </div>
//             <div className="flex justify-between">
//               <p>DELIVERY</p>
//               <p>FREE</p>
//             </div>
//             <div className="flex text-black font-bold">
//               <p>
//                 <strong>ADD PROMO CODE </strong>
//               </p>
//               <strong> + </strong>
//             </div>
//             <div className="flex-grow border-t border-black"></div>
//             <div className="flex justify-between text-black font-bold">
//               <p className="underline underline-offset-2">
//                 <strong>CHECKOUT </strong>
//               </p>
//               <strong>{} </strong>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div onClick={handleBack} className="flex py-10 cursor-pointer">
//         <img src={backArrowIcon} alt="" /> GO BACK{" "}
//       </div>
//     </div>
//   );
// }

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Example() {
  const [open, setOpen] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const { cartItem, removeItem } = useContext(ShopContext);

  cartItem.map((i) => {
    setSubTotal((prevState) => ({ ...(prevState + i.items.prevprice) }));
  });

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
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
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cartItem.map((product) => (
                                <li key={product.key} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={product.item.image}
                                      alt={product.item.title}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href={product.href}>
                                            {product.item.title}
                                          </a>
                                        </h3>
                                        <p className="ml-4">
                                          {product.item.prevprice}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.color}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-500">
                                        Qty {product.item.quantity}
                                      </p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-neutral-600 hover:text-neutral-500"
                                          onClick={() =>
                                            removeItem(product.key)
                                          }
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${subTotal}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <a
                            href="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-neutral-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-neutral-700"
                          >
                            Checkout
                          </a>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or{" "}
                            <button
                              type="button"
                              className="font-medium text-neutral-600 hover:text-neutral-500"
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
      </Transition.Root>{" "}
    </>
  );
}
