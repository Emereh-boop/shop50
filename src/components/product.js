import React, { useContext } from "react";
import ShopContext from "../context/cart/shop-context";

export default function Product(props) {
  const { addToCart } = useContext(ShopContext);

  return (
    <div
      key={props.title}
      className=" bg-white justify-between flex flex-col gap-6"
    >
      <div>
        <img className=" h-400 object-contain" src={props.image} alt="" />
        <div>
          <h3 className="text-l font-bold">{props.title}</h3>
          <div>
            <span className=" font-medium">${props.currentprice}.00</span>{" "}
            <span className=" line-through text-gray-400">
              {" "}
              ${props.prevprice}.00
            </span>{" "}
            <span className="font-bold text-nowrap">
              {" "}
              {props.discount}% 0FF
            </span>
          </div>
          <div className="text-xs text-gray-600">
            <p>{props.quantity} COLORS</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => addToCart(props.products)}
          className="ring-2 ring-black py-1 px-2 w-1/2 md:px-5 rounded-md hover:bg-neutral-100"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
