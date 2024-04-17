import React, { useContext, useState } from "react";
import searchIcon from "../images/search.svg";
import menuIcon from "../images/menu.svg";
import cartIcon from "../images/cart.svg";
import accountIcon from "../images/account.svg";
import ShopContext from "../context/cart/shop-context";
import DropDownProfile from "../pages/DropDownProfile";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(true);
  const [drop, setDrop] = useState(false);

  const handleCart = () => {
    window.location.href = "/cart";
  };
  const handleMenu = () => {
    return setIsMobile(!isMobile);
  };

  const { cartItem, userIsLoggedIn } = useContext(ShopContext);
  return (
    <div
      onMouseLeave={() => setDrop(false)}
      className="relative py-10 flex justify-center"
    >
      <div className="fixed top-0 w-screen cursor-pointer flex  flex-col-reverse py-3 px-6 gap-6 text-sm justify-between  text-black bg-white md:flex-row md:px-20 md:py-8">
        <div
          className={
            isMobile === true
              ? " hidden md:flex md:gap-2"
              : "flex  md:flex-row justify-between gap-2 md:gap-2 cursor-pointer"
          }
        >
          <span>ALL PRODUCTS</span>
          <span>NEW ARRIVALS</span>
          <span>COLLECTIONS</span>
        </div>
        <div className="flex gap-10 order-3 md:order-none">
          <img
            onClick={handleMenu}
            className="md:hidden order-1 m-0 p-0 w-8 h-10"
            src={menuIcon}
            alt=""
          />
          <div className=" text-2xl order-2 md:order-none">
            <strong
              className="font-extrabold
        "
            >
              BAGHARMONY
            </strong>
          </div>
        </div>

        <div
          className={
            isMobile === true
              ? "hidden md:flex md:gap-4"
              : "order-2 flex flex-wrap flex-shrink md:flex-row justify-between gap-3 md:gap-2"
          }
        >
          <div>
            <div
              className="flex flex-row-reverse mb-2 border-0 py-1.5 pl-3 pr-2 text-gray-900 ring-1 ring-black ring-inset rounded-full justify-between bg-transparent
            md:mb-0 md:py-0.5 "
            >
              <img
                className="w-5 h-5 object-contain pt-1"
                src={searchIcon}
                alt="search"
              />
              <input
                className=" w-1/2 border-0 text-gray-900 ring-0 ring-inset  placeholder:text-gray-400 focus:ring-none outline-none md:text-md md:leading-6"
                type="search"
                placeholder="Search"
              />
            </div>
          </div>
          <div onClick={handleCart} className="flex relative ">
            <img className="w-10 h-6" src={cartIcon} alt="" />
            <span
              className={
                cartItem.length
                  ? " absolute top-0 left-6 right-0 text-xs bg-red-600 w-4 h-4 text-center text-white rounded-full"
                  : "hidden"
              }
            >
              {cartItem.length}
            </span>
          </div>
          <div
            onMouseOverCapture={() => setDrop(true)}
            className="flex w-1/4 relative"
          >
            <img
              className="w-10 h-6 absolute bottom-1 left-0 right-6"
              src={accountIcon}
              alt=""
            />
          </div>
        </div>
        {drop && <DropDownProfile />}
      </div>
    </div>
  );
}
