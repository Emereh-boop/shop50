import React from "react";
import { Facebook, Instagram, TwitterX } from "react-bootstrap-icons";
import { useAuth } from "../../context/auth/context";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer
      className={`py-10 px-5 static gap-5 flex flex-col bg-secondary dark:invert-0 invert text-black`}
    >
      <div className="flex text-7xl font-black justify-center lg:text-9xl">
        YNT
      </div>
      <hr className="text-gray-400" />
      <div className="flex gap-2 justify-between flex-col lg:flex-row">
        <div className="lg:col-span-2 text-gray-400">
          <h1 className="uppercase font-semibold mb-1 lg:mb-4 text-black">NEWSLETTER</h1>
          <p className="lg:mb-4 text-sm lg:text-base mb-1">
            Stay in touch with the latest updates about our products and offers.
          </p>
          <form method="post" href="#" className="flex items-center">
            <input
              type="email"
              className="flex-1 p-2 rounded-l-sm bg-transparent text-black ring-1 ring-black focus:outline-none"
              placeholder="Email"
            />
            <button
              type="submit"
              className="p-2 bg-black rounded-r-md ring-black ring-1 text-secondary hover:bg-black/80"
            >
              Join
            </button>
          </form>
        </div>
        <div>
          <h1 className="font-bold text-sm lg:text-lg">STORE</h1>
          <ul className="text-gray-300 text-xs lg:text-base hover:underline">
            <li>
              <a href="/about">About us</a>
            </li>
            <li>
              <a href="/find">Find store</a>
            </li>
            <li>
              <a href="/collections">Categories</a>
            </li>
            <li>
              <a href="/blogs">Blogs</a>
            </li>
          </ul>
        </div>
        <div >
          <h1 className="font-bold text-sm lg:text-lg"> INFORMATION</h1>
          <ul className="text-gray-300 text-xs lg:text-base hover:underline">
            <li>
              <a href="/refund">
                Money refund
              </a>
            </li>
            <li>
              <a href="/shipping">
                Shipping info
              </a>
            </li>
            <li>
              <a href="/refunds">
                Refunds
              </a>
            </li>
          </ul>
        </div>
        <div >
          <h1 className="font-bold text-sm lg:text-lg">SUPPORT</h1>
          <div className="flex gap-4 flex-row lg:flex-col">
            <ul className="text-gray-300 text-xs lg:text-base hover:underline">
              <li>
                <a href="/help" >
                  Help center
                </a>
              </li>
              <li>
                <a href="/documents">
                  Documents
                </a>
              </li>
              <li>
                <a href="/account">
                  Account restore
                </a>
              </li>
              <li>
                <a
                  href={`/${user?.uid}/order`}
                  className="text-gray-300 hover:underline"
                >
                  My orders
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h1 className="font-bold text-sm lg:text-lg">FOLLOW US</h1>
          <div className="flex gap-4 flex-row lg:flex-col">
           <a href="www.facebook.com/ynt"> <Facebook  className="text-blue-500 " size={20} /> </a>
           <a href="www.instagram.com/ynt"><Instagram href="www.instagram.com/ynt" className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] via-[#8134AF] to-[#515BD4] text-white p-[0.09rem] rounded-sm " size={20} /></a>
           <a href="www.twitter.com/ynt"> <TwitterX href="www.twitter.com/ynt" className="text-black " size={20} /></a>
          </div>
        </div>
      </div>
      <hr className="text-gray-400 hidden lg:block" />
      <p className="flex justify-center text-xs lg:text-sm text-gray-500 p-2 lg:p-4">
        COPYRIGHT 2023 COMPANY ALL RIGHTS RESERVED
      </p>
    </footer>
  );
}
