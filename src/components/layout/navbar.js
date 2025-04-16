import React, { useEffect, useState, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../../context/cart/context";
import { useProducts } from "../../context/products/context";
import {
  Cart2,
  PersonCircle,
  Search,
  X,
} from "react-bootstrap-icons";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Logout from "../../pages/auth/Logout";
import Logo from "../../images/yntlogo.png";
// import Logo from "../images/logo.jpg";
import { useAuth } from "../../context/auth/context";
import { useUser } from "../../context/user/context";
import Cart from "../../pages/user/cart";
import LoginModal from "../../pages/auth/Login";
import { LogoutOutlined } from "@mui/icons-material";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const { cartItems = [] } = useCart();
  const { products = {} } = useProducts();
  const { userData } = useUser();
  const prod = products?.products;
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState([]);
  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/", current: true },
    { name: "Trending", href: "/trend", current: false },
    { name: "Collections", href: "/collections", current: false },
    { name: "New Arrivals", href: "/new", current: false },
  ]);
  // const navigate = useNavigate();
  const { user } = useAuth();
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

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [cart, setCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <Disclosure as="nav" className=" shadow-md ">
      {({ open }) => (
        <div className="fixed bg-secondary right-0 left-0 top-0 z-10">
          <div className="mx-auto max-w-7xl px- 4 static md:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-500 hover:bg-gray-200 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <img
                      className=" object-cover block w-10 h-10 rounded-full"
                      src={Logo}
                      alt="nahtty"
                      loading="lazy"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 gap-3 lg:items-center lg:justify-start">
                <div className="hidden md:block">
                  <img
                    className=" object-cover w-10 h-10 rounded-full"
                    src={Logo}
                    alt="nahtty"
                    loading="lazy"
                  />
                </div>
                <div className="hidden ml-6 sm:block">
                  <div className="flex space-x-1 md:space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "text-black bg-gray-200"
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
                {/* Search Icon for Mobile */}
                <button
                  onClick={() => setShowSearch(true)}
                  className="block lg:hidden p-2 text-gray-700 focus:outline-none"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Full-Screen Mobile Search Overlay */}
                {showSearch && (
                  <div className="fixed inset-0 bg-white z-50 flex flex-col items-start justify-start p-4">
                    <div className="relative w-full max-w-md">
                      <input
                        type="search"
                        className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button
                        onClick={() => setShowSearch(false)}
                        className="absolute right-3 top-3 text-gray-500"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    {searchTerm && (
                      <ul className="w-full max-w-md bg-white mt-2 shadow-lg rounded-md">
                        {filter.length > 0 ? (
                          filter.map((product) => (
                            <li
                              key={product.id}
                              onClick={() => {
                                window.location.href = `/product/${product.id}`;
                                setShowSearch(false);
                              }}
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              {product.title}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-700">
                            No results found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}

                {/* Search Bar (Visible on Larger Screens) */}
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
                        {filter.length > 0 ? (
                          filter.map((product) => (
                            <li
                              key={product.id}
                              onClick={() =>
                                (window.location.href = `/product/${product.id}`)
                              }
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              {product.title}
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
              </div>
              <div className="flex items-center justify-end space-x-4">
                {/* Cart Icon */}
                <button
                  type="button"
                  onClick={() => setCart((p) => !p)}
                  className="relative rounded-sm p-1.5 text-gray-700 focus:outline-none"
                >
                  <Cart2 className="h-7 w-7" aria-hidden="true" />
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
                    <Menu.Items className="absolute right-0 lg:left-0 z-10 mt-2 w-48 origin-top-right rounded-sm bg-white py-1 shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {!user ? (
                        <>
                          {" "}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/register"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-600"
                                )}
                              >
                                Sign Up
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setShowLoginModal(true)}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-600 w-full text-left"
                                )}
                              >
                                Login
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <>
                          {/* Greeting with User Name and Email */}
                          <div>
                            <h1 className="px- mx-2 py- text-lg font-semibold text-gray-600">
                              {userData?.displayName
                                ? userData.displayName
                                : "User"}
                            </h1>
                            <p className="px- mx-2 py- text-sm text-gray-600">
                              {user?.email
                                ? user.email
                                : //   .replace(
                                  //   /(^.{3})(.*)(?=@)/,
                                  //   "$1***"
                                  // )
                                  ""}
                            </p>
                          </div>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={`/${userData?.uid}/orders`}
                                className={`block px-3 py-1 mt-2 text- text-gray-600 cursor-pointer ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                orders
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={`/${userData?.uid}/orders`}
                                className={`block px-3 py-1 text- text-gray-600 cursor-pointer ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                shipping
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                onClick={() => setIsLogoutOpen(true)}
                                className={`block px-3 py-1 mt-3 text- text-red-400 gap-1 cursor-pointer ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                <LogoutOutlined className="w-3" /> Log out
                              </div>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
                {/* Conditional Rendering of Cart and Logout Components */}
                {showLoginModal && (
                  <LoginModal
                    setIsOpen={setShowLoginModal}
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                  />
                )}

                {isLogoutOpen && (
                  <Logout isOpen={isLogoutOpen} setIsOpen={setIsLogoutOpen} />
                )}
                {cart && <Cart />}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="flex space-y-1 items-center p-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  // onClick={() => handleClick(item.name)}
                  className={classNames(
                    item.current
                      ? "text-blue-950 bg-gray-200"
                      : "text-gray-400 hover:text-black",
                    "block rounded-sm px-3 py-1 text-sm font-medium"
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
