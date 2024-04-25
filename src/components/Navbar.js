import React, { useContext, useState } from "react";
import ShopContext from "../context/cart/shop-context";
import { CartFill, PersonFill, Search } from "react-bootstrap-icons";
import Cart from "../pages/cart";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logout from "./Logout";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "New Arivals", href: "/new", current: false },
  { name: "Collections", href: "/collections", current: false },
  { name: "Trending", href: "/trend", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { cartItem, products } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState("");

  const titles = [];
  products.map((i) => {
    return titles.push(i.item.title);
  });

  const AlphabeticalSearch = () => {
    // Filter titles based on search term
    const filteredTitles = titles.filter((title) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(filteredTitles);
    return filteredTitles;
  };
  const [logout, setLogout] = useState(false);

  const [cart, setCart] = useState(false);
  const handleCart = () => {
    setCart(true);
  };
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img className="h-8 w-auto" src="" alt="Logo" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex justify-evenly pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div
                  className="filter invert flex w-1/2 h-8 flex-row-reverse mb-2 border-0 py-1.5 pl-3 pr-2 text-gray-900 ring-1 ring-black ring-inset rounded-full justify-between items-center bg-transparent
            md:mb-0 md:py-0.5 "
                >
                  <Search className="w-4 h-4" onClick={AlphabeticalSearch} />
                  <input
                    className=" w-1/2 border-0 text-gray-900 ring-0 ring-inset  placeholder:text-gray-400 bg-transparent focus:ring-none outline-none md:text-md md:leading-6"
                    type="search"
                    name="search"
                    value={searchTerm}
                    placeholder="Search "
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCart}
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Shopping cart items</span>
                  <div>
                    <CartFill className="h-6 w-6" aria-hidden="true" />
                    <span
                      className={
                        cartItem.length
                          ? " absolute top-0 left-6 right-0 animate- text-xs bg-red-600 w-4 h-4 text-center text-white rounded-full"
                          : "hidden"
                      }
                    ></span>
                  </div>
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <PersonFill className="h-8 w-8 rounded-full text-gray-400" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/register"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign Up
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/login"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Login
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              setLogout(true);
                            }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                {logout && <Logout />}
                {cart && <Cart />}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
