import React from "react";
import { ArrowRight, Facebook, Instagram } from "react-bootstrap-icons";
import { useAuth } from "../../context/auth/context";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer
      className={`py-10 px-5 static gap-5 flex flex-col bg-secondary mx-auto max-w-7xl dark:invert-0 invert text-black`}
    >
        <div className="lg:col-span- text-gray- 400 flex flex-col items-center justify-center">
          <h1 className="font-semibold mb-1 lg:mb- 4 text-black">Subscribe to our emails</h1>
          <p className="lg:mb-4 text-sm text-center lg:text- base mb-1">
            Stay in touch with the latest updates about our products and offers.
          </p>
          <form method="post" href="#" className="flex p-2 items-center rounded-sm bg-transparent text-black ring-1 ring-black">
            <input
              type="email"
              className="flex-1 bg-inherit focus:outline-none"
              placeholder="Email"
            />
            <button
              type="submit"
              className=" text-black hover:bg-black/10"
            >
              <ArrowRight className="w-4 h-4"/>
            </button>
          </form>
        </div>
      {/* <div className="flex gap-2 justify-between flex-col lg:flex-row">
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
      </div> */}
      <hr className="text-gray-400 hidden lg:block" />
      <p className="flex justify-center text-xs lg:text-sm text-gray-500 p-2 lg:p-4">
        Copyright YoungnTrendy 2024 all right reserved
      </p>
    </footer>
  );
}
