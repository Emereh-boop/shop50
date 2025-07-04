import React, { useRef } from "react";
import { useProducts } from "../../context/products/context";
import { useNavigate } from "react-router-dom";

export default function NewArrivalsComp() {
  const { products = {} } = useProducts();
  const newArrivals = Array.isArray(products?.products)
    ? products.products
        .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)) // Sort by date, descending
        .slice(0, 20) // Display latest 20 products
    : [];

  const sliderRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="md:px-4 mt-1 mx-auto max-w-7xl">
      <div className="flex justify-between items-center px-4 lg:px-1 my-5">
        <h2 className="text-xl lg:text-xl font- extrabold text-black">
          New Arrivals
        </h2>
        <button
          onClick={() => navigate("/new")}
          className="text-black hover:underline text-sm lg:text-base"
        >
          See More →
        </button>
      </div>

      <div className="relative group px-0 lg:px-0 mx-auto">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory transition-transform duration-700 ease-in-out"
        >
          {newArrivals?.length > 0 ? (
            newArrivals.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 w-60 lg:w-[20rem] snap-start"
              >
                <div className="relative">
                  <img
                    className="w-full h-60 object-center hover:scale-105 lg:h-[25rem] object-cover rounded-sm transition-transform duration-500 ease-in-out"
                    src={p.imageUrl || p.image}
                    alt={p.title}
                    loading="lazy"
                  />
                </div>
              </div>
            ))
          ) : (
            [...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-60 lg:w-[20rem] snap-start animate-pulse border border-gray-200 shadow-sm rounded-sm p- ${i > 1 ? "hidden sm:block" : ""
                  }`}
              >
                <div className="bg-gray-300 h-[24rem] w-full rounded mb-2" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
