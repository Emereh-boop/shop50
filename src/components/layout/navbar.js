import React, { useEffect, useState, Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart/context";
import { useProducts } from "../../context/products/context";
import { Cart4, PersonCircle, Search } from "react-bootstrap-icons";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logout from "../../pages/auth/Logout";
// import Logo from "../images/logo.jpg";
import Cart from "../../pages/cart";
// import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
// import { db } from "../firebase"; // Make sure your Firebase config is properly imported

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation()
  const { cartItems = [] } = useCart();
  const { products = {} } = useProducts();
  const prod = products?.products ;
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState([]);
  const [navigation, setNavigation] = useState([
    { name: "Shop", href: "/", current: true },
    { name: "Most Wanted", href: "/trend", current: false },
    { name: "Collections", href: "/collections", current: false },
    { name: "New Arrivals", href: "/new", current: false },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    setNavigation((prev) =>
      prev.map((item) => ({
        ...item,
        current: item.href === location.pathname, // Mark current if the URL matches
      }))
    );
  }, [location.pathname]);

  useEffect(() => {
    if (!prod || !Array.isArray(prod)) {
      setFilter([]);
      return;
    }
  
    if (searchTerm) {
      const filtered = prod.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilter(filtered);
    } else {
      setFilter(prod);
    }
  }, [searchTerm, prod]);
  
  const [logout, setLogout] = useState(false);
  const [cart, setCart] = useState(false);

  return (
    <Disclosure as="nav" className=" shadow-md ">
      {({ open }) => (
        <div className="fixed bg-secondary right-0 left-0 top-0 z-30">
          <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-500 hover:bg-gray-200 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="font-black text-primary text-xl">
                  {/* <img
                    className=" w-40 h-5 object-contain"
                    src={Logo}
                    alt="nahtty"
                  /> */}
                  YNT
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "text-primary bg-zinc-200"
                            : "text-gray-400 hover:text-black",
                          "rounded-sm px-3 py-1 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-4">
                {/* Search Bar */}
                <div className="relative hidden lg:block">
                  <div className="flex items-center bg-neutral-100 rounded-sm px-3 py-1.5">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      className="bg-transparent border-0 text-gray-700 placeholder-gray-400 focus:ring-0 focus:outline-none pl-2"
                      type="search"
                      name="search"
                      value={searchTerm}
                      placeholder="Search"
                      onInput={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {searchTerm && (
                    <div className="absolute z-10 w-full bg-white mt-1 rounded-sm shadow-lg">
                      <ul className="py-1">
                        {filter?.length > 0 ? (
                          filter.map((l, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                (window.location.href = `/product/${l.id}`)
                              }
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              {l.title}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-sm text-gray-700">
                            No results found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {/* Cart Icon */}
                <button
                  type="button"
                  onClick={() => setCart((p) => !p)}
                  className="relative rounded-sm p-1.5 text-gray-700 focus:outline-none"
                >
                  <Cart4 className="h-7 w-7" aria-hidden="true" />
                  {cartItems?.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItems?.length}
                    </span>
                  )}
                </button>
                {/* Profile Dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center rounded-sm p-1 text-gray-700 focus:outline-none">
                    <PersonCircle className="h-7 w-7" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-sm bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => navigate("/")}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                            )}
                          >
                            Profile
                          </div>
                        )}
                      </Menu.Item>
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
                            onClick={() => setLogout(true)}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                            )}
                          >
                            Log out
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                {/* Conditional Rendering of Cart and Logout Components */}
                {logout && <Logout />}
                {cart && <Cart />}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="flex space-y-1 p-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  // onClick={() => handleClick(item.name)}
                  className={classNames(
                    item.current
                      ? "text-primary bg-zinc-200"
                      : "text-gray-400 hover:text-black",
                    "block rounded-sm px-3 py-1 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
