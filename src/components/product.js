import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import ShopContext from "../context/cart/shop-context";
import { Cart4 } from "react-bootstrap-icons";

export default function Product(props) {
  const { addToCart, formatCurrency } = useContext(ShopContext);

  return (
    <div
      key={props.product.id}
      className="bg-white shadow-sm shadow-neutral-200 ring-1 ring-primary overflow-hidden transition-transform transform"
    >
      <div className="relative">
        {props.product.onsale && (
          <div className="absolute z-50 left-4 top-4 bg-primary text-white text-sm px-2 py-1  shadow-lg transition-all duration-300 hover:bg-red-400">
            {/* <Heart className="text-black" color="black" size={20} /> */}
            on sale
          </div>
        )}
        {/* : (
          <div className="absolute z-50 left-4 top-4 bg-white text-primary ring-[1px] ring-primary text-sm px-2 py-1 rounded-sm shadow-lg transition-all duration-300 hover:bg-neutral-100">
            out of stock
          </div>
        ) */}

        <Link to={`/product/${props.product.id}`} className="block">
          <img
            className="relative rounded lg:h-[28rem] h-72 w-full object-cover"
            src={props.product.imageUrl || props.product.image}
            alt={props.product.title}
          />
        </Link>
      </div>
      <div className="flex flex-col ">
        <div className=" gap-2 justify-between flex">
          <span className="py-1 px-2 bg-white md:text-base text-primary hover:bg-white/70 flex items-center truncate">
            {props.product.title}
          </span>
          <span className="py-1 font-bold md:text-lg px-2 bg-white text-primary hover:bg-white/70  flex items-center ">
            {formatCurrency(props.product.price)}
          </span>
        </div>
        <div className="justify-between items-center flex pb-2 px-2">
          <p className="py-1 gap-2 bg-white text-sm text-primary flex flex-col truncate">
            <span> available colors {props.product.colors.length}</span>
            {/* <p className="flex gap-2 ">
              {props.product.colors?.map((c) => (
                <div
                  className={`p-2 ring-[1px] ring-${c} rounded-full bg-${c}`}
                ></div>
              ))}
            </p> */}
          </p>
          <button
            onClick={() => addToCart(props.product)}
            type="button"
            className="py-1 px-2  text-primary flex"
          >
            <Cart4 className="h-6 w-6" />
          </button>
          {/* <div>
            {
              props.product.discount > 0 && (
                <span className="py-1 px-2 bg-white hover:bg-white/70  flex items-center text-gray-400 line-through">
                  ${props.product.price}
                </span>
              )
              ) : (
                <span className="py-1 px-2 bg-white text-gray-400 hover:bg-white/70  flex items-center ">
                  $
                  {calculateDiscount(props.product.price, props.product.discount)}
                </span>
              )
            }
          </div> */}
        </div>
        {/* <div className="flex items-center justify-between ml-1 mt-3">
          <button
            onClick={() => addToCart(props.product)}
            type="button"
            className="lg:py-2 p-2 lg:px-4 bg-primary text-white hover:bg-primary/70 transition-colors flex items-center justify-center"
          >
            <Cart4 className="h-6 w-6" />
          </button>
          <h3 className="text-md font-medium mb-1">{props.product.title}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-lg  text-black"></span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
