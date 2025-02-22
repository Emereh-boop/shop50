import React, { useContext, useState } from "react";

import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/products/context";

function Hero() {
  const { products = {} } = useProducts();
  const banners = products?.banners || []
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (href) => {
    if (!href) return; // Handle cases where href is undefined
    if (href.startsWith("http") || href.startsWith("www.")) {
      window.open(href.startsWith("www.") ? `https://${href}` : href, "_blank");
    } else {
      navigate(href);
    }
  };

  const prevSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  const nextSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );

  return (
    <div className="relative flex items-center justify-center min-h-[70vh] bg-black">
      {banners.length > 0 && (
        <>
          <img
            src={banners[currentIndex].imageUrl}
            alt={banners[currentIndex].title}
            className="absolute inset-0 object-cover lg:object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 w-full max-w-6xl px-6 text-center py-20">
            <h2 className="text-white text-xl font-extrabold mb-4">
              {banners[currentIndex].brand}
            </h2>
            <h3 className="text-white text-3xl lg:text-7xl font-semibold  mb-2">
              {banners[currentIndex].title}
            </h3>
            <p className="text-white text-xl lg:text-4xl font-[100] mt-4 mb-6">
              {banners[currentIndex].description ||
                banners[currentIndex].subtitle}
            </p>
            <button
              onClick={() =>
                handleNavigation(banners[currentIndex]?.href)
              }
              className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-sm hover:bg-gray-100 transition"
            >
              Shop {banners[currentIndex].brand}
            </button>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 p-3 bg-gray-100/5 rounded-sm text-white  font-bold focus:outline-none hover:bg-gray-700 transition"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-3 bg-gray-100/5 rounded-sm text-white font-bold focus:outline-none hover:bg-gray-700 transition"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}
    </div>
  );
}

export default Hero;
