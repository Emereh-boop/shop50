import React, { useRef, useContext } from "react";
import { formatCurrency } from "../../utils/format";
import {
  // CartPlus,
  ChevronCompactLeft,
  ChevronCompactRight,
  // HeartFill,
} from "react-bootstrap-icons";
import { useProducts } from "../../context/products/context";

export default function TrendingComp() {
  const sliderRef = useRef(null);
  const { products = {} } = useProducts();
  const trending = products?.trending || [];

  const slideLeft = () => {
    sliderRef.current.scrollBy({
      left: -300, // Adjust based on the product card width
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current.scrollBy({
      left: 300, // Adjust based on the product card width
      behavior: "smooth",
    });
  };

  return (
    <div className=" bg-white">
      <div className="text-start text-4xl font-extrabold text-black my-5">
        TRENDING
      </div>
      <div className="relative group mx-auto max-w-[90rem] px-6 lg:px-8">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 snap-x snap-mandatory"
        >
          {trending?.length ? (
            trending.slice(0, 16).map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-72 lg:w-80 snap-start"
              >
                <div className="relative">
                  <img
                    className="w-full h-60 lg:h-[25rem] object-cover transition-transform duration-300 hover:sale-105"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                  <span>
                    <div className="absolute bg-white p-2 bottom-4 left-1 text-sm font-medium text-gray-400">
                      {formatCurrency(product.price)}
                    </div>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-md font-semibold text-black">
                    {product.title}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Loading ...</p>
          )}
        </div>

        <ChevronCompactLeft
          onClick={slideLeft}
          size={40}
          className="hidden group-hover:block absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 text-white cursor-pointer rounded-full z-10 hover:bg-black transition"
        />

        <ChevronCompactRight
          onClick={slideRight}
          size={40}
          className="hidden group-hover:block absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 text-white cursor-pointer rounded-full z-10 hover:bg-black transition"
        />
      </div>
    </div>
  );
}
