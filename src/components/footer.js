import React, { useState } from "react";
import { Facebook, Instagram, TwitterX, Whatsapp } from "react-bootstrap-icons";

export default function Footer() {
  const [languageDropdown, setLanguageDropdown] = useState(false);

  const toggleLanguageDropdown = () => {
    setLanguageDropdown(!languageDropdown);
  };
  return (
    // <footer className="px-3 static gap-8 flex flex-col bg-black invert text-white">
    //   <div className="flex col-span-4 text-5xl justify-center md:text-9xl">
    //     BAGHARMONY
    //   </div>
    //   <hr className="text-gray-400" />
    //   <div className="py-4 md:py-16 flex gap-4 md:gap-0 justify-between flex-col md:flex-row">
    //     <div className="">
    //       <h1 className="font-bold">NEWSLETTER</h1>
    //       <form className="mt-4 p-1 ring-1 ring-gray-200 flex justify-around">
    //         <input
    //           className=" outline-none bg-inherit"
    //           type="email"
    //           name="subscribe"
    //           placeholder="Enter your email"
    //         />
    //         <button type="submit" className="text-base">
    //           SUBSCRIBE
    //         </button>
    //       </form>
    //     </div>
    //     <div className="rev">
    //       <h1 className="font-bold">COMPANY</h1>
    //       <div>CONTACT US</div>
    //       <div>FAQ'S'</div>
    //       <div>ORDER LOOKUP</div>
    //       <div>RETURNS</div>
    //     </div>
    //     <div className="rev">
    //       <h1 className="font-bold"> ABOUT US</h1>
    //       <div>CAREERS</div>
    //       <div>NEWS & BLOG</div>
    //       <div>PRESS CENTER</div>
    //       <div>SUPPLIERS</div>
    //     </div>
    //     <div className="flex flex-col gap-2 ">
    //       <h1>FOLLOW US</h1>
    //       <div className="flex gap-4 flex-row md:flex-col">
    //         <Facebook size={23} />
    //         <Instagram size={23} />
    //         <TwitterX size={23} />
    //         <Whatsapp size={23} />
    //       </div>
    //     </div>
    //   </div>
    //   <hr />
    //   <p className="flex justify-center text-sm text-gray-400 p-3 md:p-8">
    //     COPYRIGHT 2023 COMPANY ALL RIGHTS RESERVED
    //   </p>
    // </footer>
    <footer className="bg-primary text-center text-white text-sm py-4 mt-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Logo and Copyright */}
          <div className="lg:col-span-3 mb-6 lg:mb-0">
            <a
              href="https://PIQmarket.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold"
            >
              PIQ
            </a>
            <p className="mt-2">© 2024 PIQmarket.com</p>
          </div>

          {/* Store Links */}
          <div>
            <h6 className="uppercase font-semibold mb-4">Store</h6>
            <ul>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Find store
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h6 className="uppercase font-semibold mb-4">Information</h6>
            <ul>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Money refund
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Shipping info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Refunds
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h6 className="uppercase font-semibold mb-4">Support</h6>
            <ul>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Documents
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  Account restore
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:underline">
                  My orders
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h6 className="uppercase font-semibold mb-4">Newsletter</h6>
            <p className="mb-4">
              Stay in touch with the latest updates about our products and
              offers.
            </p>
            <div className="flex items-center">
              <input
                type="email"
                className="flex-1 p-2 rounded-l-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none"
                placeholder="Email"
              />
              <button className="p-2 bg-blue-500 rounded-r-md text-white hover:bg-blue-600">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="flex lg:flex-col flex-row justify-between items-center mt-6 pt-4 border-t border-white">
          <div className="flex space-x-4">
            <i className="fab fa-lg fa-cc-visa"></i>
            <i className="fab fa-lg fa-cc-amex"></i>
            <i className="fab fa-lg fa-cc-mastercard"></i>
            <i className="fab fa-lg fa-cc-paypal"></i>
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center space-x-2 text-white lg:mt-4 mt-0"
            >
              <i className="flag-united-kingdom flag"></i>
              <span>English</span>
              <i
                className={`fas fa-chevron-down transform ${
                  languageDropdown ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {languageDropdown && (
              <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg">
                <li className="py-2 px-4 hover:bg-gray-100 flex justify-between items-center">
                  <i className="flag-united-kingdom flag"></i>
                  English
                  <i className="fa fa-check text-green-500"></i>
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <i className="flag-poland flag"></i>
                  Polski
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <i className="flag-china flag"></i>
                  中文
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <i className="flag-japan flag"></i>
                  日本語
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <i className="flag-germany flag"></i>
                  Deutsch
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <i className="flag-france flag"></i>
                  Français
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <i className="flag-spain flag"></i>
                  Español
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <i className="flag-russia flag"></i>
                  Русский
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <i className="flag-portugal flag"></i>
                  Português
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
