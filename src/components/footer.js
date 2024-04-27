import React from "react";
import { Facebook, Instagram, TwitterX, Whatsapp } from "react-bootstrap-icons";

export default function Footer() {
  return (
    <footer className="px-3 static gap-8 flex flex-col bg-black invert text-white">
      <div className="flex col-span-4 text-5xl justify-center md:text-9xl">
        BAGHARMONY
      </div>
      <hr className="text-gray-400" />
      <div className="py-4 md:py-16 flex gap-4 md:gap-0 justify-between flex-col md:flex-row">
        <div className="">
          <h1 className="font-bold">NEWSLETTER</h1>
          <form className="mt-4 p-1 ring-1 ring-gray-200 flex justify-around">
            <input
              className=" outline-none bg-inherit"
              type="email"
              name="subscribe"
              placeholder="Enter your email"
            />
            <button type="submit" className="text-base">
              SUBSCRIBE
            </button>
          </form>
        </div>
        <div className="rev">
          <h1 className="font-bold">COMPANY</h1>
          <div>CONTACT US</div>
          <div>FAQ'S'</div>
          <div>ORDER LOOKUP</div>
          <div>RETURNS</div>
        </div>
        <div className="rev">
          <h1 className="font-bold"> ABOUT US</h1>
          <div>CAREERS</div>
          <div>NEWS & BLOG</div>
          <div>PRESS CENTER</div>
          <div>SUPPLIERS</div>
        </div>
        <div className="flex flex-col gap-2 ">
          <h1>FOLLOW US</h1>
          <div className="flex gap-4 sm:flex-row md:flex-col">
            <Facebook size={23} />
            <Instagram size={23} />
            <TwitterX size={23} />
            <Whatsapp size={23} />
          </div>
        </div>
      </div>
      <hr />
      <p className="flex justify-center text-sm text-gray-400 p-3 md:p-8">
        COPYRIGHT 2023 COMPANY ALL RIGHTS RESERVED
      </p>
    </footer>
  );
}
