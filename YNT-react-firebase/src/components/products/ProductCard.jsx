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
    <div className="bg-white shadow-sm shadow-neutral-200 ring- ring-gray-300 overflow-hidden transition-transform transform">
      <div className="relative">
        {!props.product.onsale && (
          <div className="absolute z-50 left-4 top-4 bg-red-500 text-white text-xs px-2 py-1 transition-all duration-300 hover:bg-red-400">
            Almost sold out
          </div>
        )}
        <Link to={`/product/${props.product.id}`} className="block">
          <img
            className="relative rounded lg:h-[28rem] h-72 w-full object-cover"
            src={props.product.imageUrl || props.product.image}
            alt={props.product.title}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="gap-2 justify-between flex">
          <span className="py-1 px-2 bg-white md:text-base text-black flex items-center truncate">
            {props.product.title}
          </span>
          <span className="py-1 hidden  font-bold md:text-lg px-2 bg-white text--400 md:flex items-center">
            {formatCurrency(props.product.price)}
          </span>
        </div>
        <div className="justify-between items-center flex pb-2 px-2">
        </div>
      </div>
    </div>
  );
}
