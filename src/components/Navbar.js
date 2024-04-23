import React, { useContext, useState } from "react";
import searchIcon from "../images/search.svg";
import menuIcon from "../images/menu.svg";
import cartIcon from "../images/cart.svg";
import ShopContext from "../context/cart/shop-context";
import DropDownProfile from "../pages/DropDownProfile";
import DropDownCategory from "./DropDownCategory";
import {
  CaretDownFill,
  Heart,
  Person,
  ThreeDotsVertical,
} from "react-bootstrap-icons";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  const handleCart = () => {
    window.location.href = "/cart";
  };
  const handleMenu = () => {
    return setIsMobile(!isMobile);
  };

  const { cartItem, currentUser } = useContext(ShopContext);
  return (
    <div className="relative h-10">
      <div className=" top-1 cursor-pointer flex  flex-col-reverse py-3 px-6 gap-6 text-sm justify-between  text-black bg-stone-100/95 md:flex-row md:px-20 md:py-8">
        <div
          className={
            !isMobile === false
              ? " hidden md:flex md:gap-2"
              : "flex  md:flex-row gap-2 md:w-1/3 md:gap-5 cursor-pointer"
          }
        >
          <span onClick={() => (window.location.href = "/")}> HOME </span>
          <div className="group h-10">
            <span className="flex gap-2">
              {" "}
              CATEGORIES <CaretDownFill className="self-center" size={15} />
            </span>
            <div className="hidden group-hover:block">
              {" "}
              <DropDownCategory />
            </div>
          </div>
        </div>
        <div className="flex gap-10 justify-start justify-self-center order-3 md:order-none md:w-1/3">
          <ThreeDotsVertical
            onClick={handleMenu}
            className="md:hidden order-1 "
            size={25}
          />
          <div className=" text-2xl order-2  md:order-none">
            <strong
              className="font-extrabold
        "
            >
              BRAND NAME
            </strong>
          </div>
        </div>

        <div
          className={
            isMobile === true
              ? "hidden md:flex md:gap-4"
              : "order-2 flex md:flex-row justify-between gap-3 md:gap-2 md:w-1/3"
          }
        >
          <div
            className="flex w-1/2 h-8 flex-row-reverse mb-2 border-0 py-1.5 pl-3 pr-2 text-gray-900 ring-1 ring-black ring-inset rounded-full justify-between items-center bg-transparent
            md:mb-0 md:py-0.5 "
          >
            <img
              className="w-5 h-5 object-contain pt-1"
              src={searchIcon}
              alt="search"
            />
            <input
              className=" w-1/2 border-0 text-gray-900 ring-0 ring-inset  placeholder:text-gray-400 bg-transparent focus:ring-none outline-none md:text-md md:leading-6"
              type="search"
              name="search"
              placeholder="Search"
            />
          </div>
          <div className="flex relative">
            <Heart className="flex relative" color="red" size={27} />
          </div>
          <div onClick={handleCart} className="flex relative ">
            <img className="w-10 h-6" src={cartIcon} alt="" />
            <span
              className={
                cartItem.length
                  ? " absolute top-0 left-6 right-0 animate- text-xs bg-red-600 w-4 h-4 text-center text-white rounded-full"
                  : "hidden"
              }
            >
              {cartItem.length}
            </span>
          </div>
          <div className="flex flex-col relative h-10 group">
            <div className="text-center flex gap-2 justify-between items-center pt-4">
              <Person className="bg-black/10 p-2 rounded-full w-[40px] h-[40px]" />
              <div className="">{currentUser.email}</div>
            </div>
            <div className="hidden group-hover:block">
              {" "}
              <DropDownProfile />{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
