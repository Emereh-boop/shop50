import React, { useEffect, useRef, useState } from "react";
import { useProducts } from "../../context/products/context";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronCompactLeft,
  ChevronCompactRight,
} from "react-bootstrap-icons";

export default function CollectionComp() {
  const navigate = useNavigate();
  const { products = {} } = useProducts();
  // Assuming products have a 'category' field and other necessary fields like 'onsale', 'instock', etc.
  const allProducts = products?.products || [];
  const sliderRef = useRef(null);
  const prods = products?.products || [];
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

  // Step 1: Filter products (if needed)
  const filteredProducts = allProducts.filter((product) => {
    // Example filter: Only include products that are on sale and in stock
    return product.onsale && product.instock;
  });

  // Step 2: Extract unique categories for collections
  const collections = Array.from(
    new Set(filteredProducts.map((product) => product.category))
  ).map((category) => {
    // Find one product to represent the collection
    const collectionProduct = filteredProducts.find(
      (product) => product.category === category
    );
    return {
      id: category, // Using category as the id
      category,
      imageUrl: collectionProduct?.imageUrl || collectionProduct?.image,
      // You can use a representative product's image or any other logic to determine the image
    };
  });

  return (
    <div className="bg-secondary mb-5">
      <div className=" mx-auto max-w-7xl px-4 group md:px-6 lg:px-8 flex justify-between items-center my-5">
        <h2 className="text- xl lg:text-xl font- extrabold text-black">
          Collections
        </h2>
        <button
          onClick={() => navigate("/collection")}
          className="text-black hover:underline text-sm lg:text-base"
        >
          See More →
        </button>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 group md:px-6 lg:px-8">
        <div
          // ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-2 snap-x snap-mandatory transition-transform duration-700 ease-in-out"
        >
          {collections?.length
            ? collections?.slice(0, 4).map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => navigate(`products/${collection.category}`)}
                  className=" flex-shrink- 0 w- 40 lg:w- 40 snap- start w- relative flex flex-col  "
                >
                  <img
                    className="w-full h-60 lg:h-[25rem] object-cover transition-transform duration-300 hover:scale-105"
                    src={collection.imageUrl || collection.image}
                    alt={collection.title}
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black opacity-30"></div>
                  <div className="z-10 w-full max-w- xl px-6 text- ">
                    <h2 className=" text-white text- lg lg:text- xl font-bold">
                      {collection.brand}
                    </h2>
                    <h1 className=" text-white text- xl flex items-center lg:text- xl lg:font- extrabold font-bold">
                      {collection.category} <ArrowRight />
                    </h1>
                  </div>
                </div>
              ))
            : [...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse border border-gray-200 shadow-sm rounded-sm p- w-full   ${
                    i > 1 ? "hidden sm:block" : ""
                  }`}
                >
                  <div className="bg-gray-300 h-[24rem] w-full rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-1/3" />
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
