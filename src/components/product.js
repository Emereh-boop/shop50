import React, { useContext, useState } from "react";
import ShopContext from "../context/cart/shop-context";
import { Heart, HeartFill } from "react-bootstrap-icons";
import Delete from "../images/delete.svg";

export default function Product(props) {
  const { addToCart, removeItem, likes, calculateDiscount, setLikes } =
    useContext(ShopContext);

  const [like, setL] = useState();

  return (
    <div
      key={props.title}
      className=" bg-white justify-between flex flex-col gap-6 rounded-xl p-5 shadow-xl"
    >
      <div className="flex justify-between flex-col">
        <div className="relative">
          <div
            className=" w-20 h-20 bg-white/0 absolute right-0 top-0"
            onClick={() => setLikes(props.products)}
          >
            {like ? (
              <HeartFill
                className="absolute right-6 top-6"
                color="red"
                size={25}
              />
            ) : (
              <Heart className="absolute right-6 top-6" color="red" size={25} />
            )}
          </div>
          <img
            className=" h-3/4 w-full object-cover"
            src={props.image}
            alt="Product"
          />
        </div>
        <div
          className="flex flex-col justify-center gap-2
        "
        >
          <h3 className="text-l font-bold">{props.title}</h3>
          <div>
            <span className=" font-medium">
              {calculateDiscount(props.prevprice, props.discount)}
            </span>{" "}
            <span className=" line-through text-gray-400">
              {props.prevprice}
            </span>{" "}
            <span className="font-bold text-nowrap">{props.discount}% 0FF</span>
          </div>
          <div className="text-xs text-gray-600">
            <p>{props.quantity} COLORS</p>
          </div>
          <div>
            <p>
              <strong>Instock</strong>: {props.inStock}
            </p>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => addToCart(props.products)}
              className="shadow-inner shadow-gray-200 py-1 px-2 w-4/5  md:p-2 rounded-md hover:bg-neutral-100"
            >
              Add to cart
            </button>
            <button
              onClick={() => removeItem(props.id)}
              className="shadow-inner shadow-gray-200 py-1 px-2 w-1/4  md:p-2 rounded-md hover:bg-red-500 flex justify-center"
            >
              <img src={Delete} alt="remove from cart" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
