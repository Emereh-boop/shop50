import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/cart/context";
import { Cart4 } from "react-bootstrap-icons";
import { formatCurrency } from "../../utils/format";

export default function Product(props) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(props.product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  return (
    <div className="bg-white shadow-sm shadow-neutral-200 ring-1 ring-gray-300 overflow-hidden transition-transform transform">
      <div className="relative">
        {props.product.onsale && (
          <div className="absolute z-50 left-4 top-4 bg-red-500 text-white text-sm px-2 py-1  shadow-lg transition-all duration-300 hover:bg-red-400">
            On Sale
          </div>
        )}
        <Link to={`/product/${props.product.id}`} className="block">
          <img
            className="relative rounded lg:h-[28rem] h-72 w-full object-cover"
            src={props.product.imageUrl || props.product.image}
            alt={props.product.title}
          />
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="gap-2 justify-between flex">
          <span className="py-1 px-2 bg-white md:text-base text-black flex items-center truncate">
            {props.product.title}
          </span>
          <span className="py-1 font-bold md:text-lg px-2 bg-white text-green-400 flex items-center">
            {formatCurrency(props.product.price)}
          </span>
        </div>
        <div className="justify-between items-center flex pb-2 px-2">
          <p className="py-1 gap-2 bg-white text-sm text-[#00000088] flex flex-col truncate">
            <span> Available Colors: {props.product.colors?.length}</span>
          </p>
          {isAdded ? (
            <button type="button" className="py-1 px-2 text-gray-700 flex">
              <svg
                className="w-6 h-6 bg-green-500 rounded-full text-white p-1 animate-check"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="py-1 px-2 text-gray-700 flex"
            >
              <Cart4 className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
