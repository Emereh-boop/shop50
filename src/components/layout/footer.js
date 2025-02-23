import React from "react";
import { Facebook, Instagram, TwitterX } from "react-bootstrap-icons";
import { useAuth } from "../../context/auth/context";

export default function Footer() {
  const {user}= useAuth()
  return (
    <footer
      className={`px-10 static gap-5 flex flex-col bg-secondary dark:invert-0 invert text-primary`}
    >
      <div className="flex text-7xl font-black justify-center md:text-9xl">
        YNT
      </div>
      <hr className="text-gray-400" />
      <div className="flex gap-4 md:gap-2 justify-between flex-col md:flex-row">
        <div className="lg:col-span-2 text-slate-400">
          <h1 className="uppercase font-semibold mb-4">NEWSLETTER</h1>
          <p className="mb-4">
            Stay in touch with the latest updates about our products and offers.
          </p>
          <form method="post" href="#" className="flex items-center">
            <input
              type="email"
              className="flex-1 p-2 rounded-l-sm bg-transparent text-primary ring-1 ring-primary focus:outline-none"
              placeholder="Email"
            />
            <button
              type="submit"
              className="p-2 bg-primary rounded-r-md text-secondary hover:bg-primary/80"
            >
              Join
            </button>
          </form>
        </div>
        <div className="rev">
          <h1 className="font-bold">STORE</h1>
          <ul>
            <li>
              <a href="/about" className="text-gray-300 hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="/find" className="text-gray-300 hover:underline">
                Find store
              </a>
            </li>
            <li>
              <a href="/collections" className="text-gray-300 hover:underline">
                Categories
              </a>
            </li>
            <li>
              <a href="/blogs" className="text-gray-300 hover:underline">
                Blogs
              </a>
            </li>
          </ul>
        </div>
        <div className="rev">
          <h1 className="font-bold"> INFORMATION</h1>
          <ul>
            <li>
              <a href="/refund" className="text-gray-300 hover:underline">
                Money refund
              </a>
            </li>
            <li>
              <a href="/shipping" className="text-gray-300 hover:underline">
                Shipping info
              </a>
            </li>
            <li>
              <a href="/refunds" className="text-gray-300 hover:underline">
                Refunds
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 ">
          <h1 className="font-bold">SUPPORT</h1>
          <div className="flex gap-4 flex-row md:flex-col">
            <ul>
              <li>
                <a href="/help" className="text-gray-300 hover:underline">
                  Help center
                </a>
              </li>
              <li>
                <a href="/documents" className="text-gray-300 hover:underline">
                  Documents
                </a>
              </li>
              <li>
                <a href="/account" className="text-gray-300 hover:underline">
                  Account restore
                </a>
              </li>
              <li>
                <a href={`/${user?.uid}/order`} className="text-gray-300 hover:underline">
                  My orders
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <h1 className="font-bold">FOLLOW US</h1>
          <div className="flex gap-4 flex-row md:flex-col">
            <Facebook href="www.facebook.com/ynt" size={23} />
            <Instagram href="www.instagram.com/ynt" size={23} />
            <TwitterX href="www.twitter.com/ynt" size={23} />
          </div>
        </div>
      </div>
      <hr className="text-gray-400" />
      <p className="flex justify-center text-sm text-gray-400 p-3 md:p-8">
        COPYRIGHT 2023 COMPANY ALL RIGHTS RESERVED
      </p>
    </footer>
  );
}
