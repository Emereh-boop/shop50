import React, { useContext } from "react";
import cancelIcon from "../images/cancel.svg";
import backArrowIcon from "../images/back-arrow.svg";
import ShopContext from "../context/cart/shop-context";
import Navbar from "../components/Navbar";
export default function Cart() {
  const { cartItem } = useContext(ShopContext);
  const [quantity, setQuantity] = React.useState(0);

  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="px-4 md:px-20 py-10 flex flex-col justify-between h-svh text-xs text-gray-600 ">
      <Navbar />
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex md:w-3/4 flex-col gap-3">
            {cartItem.length === 0 ? (
              <div className="flex flex-col align-middle">
                <h1 className="text-7xl text-black text-center">
                  {" "}
                  CART IS EMPTY{" "}
                </h1>
                <button className=" underline hover:text-blue-500 text-xl p-2  rounded-sm">
                  {" "}
                  click to add items
                </button>
              </div>
            ) : (
              cartItem.map((p, index) => {
                console.log(p, index);
                return (
                  <ol key={p.key + index}>
                    <div className="flex flex-col md:flex-row">
                      <h1 className=" font-bold text-8xl text-black ">CART</h1>
                      <div className="md:flex md:w-11/12 grid grid-cols-2 md:gap-12">
                        <img
                          className="object-contain w-28 md:w-40"
                          src={p.item.image}
                          alt=""
                        />
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-black text-xl">
                            {p.item.title}
                          </h3>
                          <p>COLOR WHITE</p>
                          <p>
                            {p.item.availability ? "IN STOCK" : "OUT OF STOCK"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between md:w-3/5">
                        <div className="md:w-1/4 flex flex-col gap-10">
                          <label htmlFor="select">SIZE</label>
                          <select className="md:w-1/2 outline-none">
                            <option></option>
                            {p.item.sizes.map((size) => {
                              return <option key={size}>{size}</option>;
                            })}
                          </select>
                        </div>
                        <div className="md:w-1/4 flex flex-col gap-10">
                          <label htmlFor="select">QUANTITY</label>
                          <div className="flex justify-between cursor-pointer">
                            <button onClick={setQuantity((prev) => prev - 1)}>
                              -
                            </button>
                            <div className="text-sm font-bold">{quantity}</div>
                            <button onClick={setQuantity((prev) => prev + 1)}>
                              +
                            </button>
                          </div>
                        </div>
                        <div className="md:w-1/4 flex flex-col gap-10">
                          {" "}
                          <label htmlFor="select">PRICE</label>
                          <div className="md:w-1/3 text-black font-bold">
                            ${p.currentprice}.99
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col h-1/2 w-1/12 justify-center text-2xl">
                        <img className="h-6 w-6" src={cancelIcon} alt="" />
                      </div>
                    </div>
                  </ol>
                );
              })
            )}
          </div>
          <div className="md:w-1/4 h-1/2 justify-end flex flex-col gap-4">
            <h2 className="font-bold text-black text-4xl">SUMMARY</h2>
            <div className="flex-grow border-t border-black"></div>
            <div className="flex justify-between text-black font-bold">
              <p>
                <strong>TOTAL PRODUCTS </strong>
              </p>
              <strong>{cartItem.length}</strong>
            </div>
            <div className="flex justify-between">
              <p>DELIVERY</p>
              <p>FREE</p>
            </div>
            <div className="flex text-black font-bold">
              <p>
                <strong>ADD PROMO CODE </strong>
              </p>
              <strong> + </strong>
            </div>
            <div className="flex-grow border-t border-black"></div>
            <div className="flex justify-between text-black font-bold">
              <p className="underline underline-offset-2">
                <strong>CHECKOUT </strong>
              </p>
              <strong>USD ${cartItem.currentprice}.00 </strong>
            </div>
          </div>
        </div>
      </div>
      <div onClick={handleBack} className="flex py-10 cursor-pointer">
        <img src={backArrowIcon} alt="" /> GO BACK{" "}
      </div>
    </div>
  );
}
