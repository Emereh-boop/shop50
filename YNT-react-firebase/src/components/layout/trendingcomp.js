import React, { useRef, useState, useEffect } from "react";
import { formatCurrency } from "../../utils/format";
import { filterTrendingProducts } from "../../utils/filtertrending";
import { ChevronCompactLeft, ChevronCompactRight } from "react-bootstrap-icons";
import { useProducts } from "../../context/products/context";
import { Load } from "../skeletons/loading";
import { useNavigate } from "react-router-dom";
import { ProductCardSkeleton } from "../skeletons/ProductCardSkeleton";

export default function TrendingComp() {
  const sliderRef = useRef(null);
  const { products = {} } = useProducts();
  const prods = products?.products || [];
  const trending = filterTrendingProducts(prods);
  const navigate = useNavigate();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        setCanScrollLeft(sliderRef.current.scrollLeft > 0);
        setCanScrollRight(
          sliderRef.current.scrollLeft + sliderRef.current.clientWidth <
            sliderRef.current.scrollWidth
        );
      }
    };

    checkScroll();
    sliderRef.current?.addEventListener("scroll", checkScroll);
    return () => sliderRef.current?.removeEventListener("scroll", checkScroll);
  }, []);

  const slideLeft = () => {
    sliderRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg- secondary mx-auto max-w-7xl px-4 group md:px-6 lg:px-8">
      <div className="flex justify-between items-center my-5">
        <h2 className="text- xl lg:text-xl font- extrabold text-black">
          Featured products
        </h2>
        <button
          onClick={() => navigate("/trend")}
          className="text-black hover:underline text-sm lg:text-base"
        >
          See More →
        </button>
      </div>

      <div className="relative ">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-1 snap-x snap-mandatory transition-transform duration-700 ease-in-out"
        >
          {trending?.length
            ? trending.slice(0, 16).map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-44 lg:w-80 snap-start"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative cursor-pointer">
                    <img
                      className="w-full h-60 lg:h-[25rem] object-cover transition-transform duration-300 hover:scale-105"
                      src={product.imageUrl}
                      alt={product.title}
                      loading="lazy"
                    />
                    <div className="absolute bg-white p-2 bottom-4 left-1 text-sm font-medium text-gray-400">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                </div>
              ))
            : [...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 w-48  lg:w-80 snap-start relative animate-pulse border border-gray-200 shadow-sm rounded-sm p-   ${
                    i > 1 ? "hidden sm:block" : ""
                  }`}
                >
                  <div className="bg-gray-300 h-60 w-full rounded mb-2" />
                  <div className="absolute bottom-2 z-10 left-2 h-6 bg-gray-200 rounded w-1/3 mb-2" />
                </div>
              ))}
        </div>

        {canScrollLeft && (
          <ChevronCompactLeft
            onClick={slideLeft}
            size={30}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 text-gray-700 cursor-pointer rounded-sm z-10 hover:bg-gray-100/50 transition"
          />
        )}

        {canScrollRight && (
          <ChevronCompactRight
            onClick={slideRight}
            size={30}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 text-gray-700 cursor-pointer rounded-sm z-10 hover:bg-gray-100/50 transition"
          />
        )}
      </div>
    </div>
  );
}
