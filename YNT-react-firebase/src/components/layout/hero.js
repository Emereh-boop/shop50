import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/products/context";
import { Load } from "../skeletons/loading";

function Hero() {
  const { products = {} } = useProducts();
  const banners = products?.banners || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex, nextSlide]); // Restart interval when currentIndex changes

  const handleNavigation = (href) => {
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("www.")) {
      window.open(href.startsWith("www.") ? `https://${href}` : href, "_blank");
    } else {
      navigate(href);
    }
  };

  // const prevSlide = () =>
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? banners.length - 1 : prevIndex - 1
  //   );

  const goToSlide = (index) => setCurrentIndex(index); // Jump to a specific slide

  return (
    <div className="relative flex items-center justify-center min-h-[30vh] lg:min-h-[70vh] bg-black">
      {banners?.length > 0 ? (
        <>
          <img
            src={banners[currentIndex]?.imageUrl}
            alt={banners[currentIndex]?.title}
            className="absolute inset-0 object-cover object-center w-full h-full"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Text Content */}
          <div className="relative w-full md:max-w-6xl px-1 md:px-6 text-center md:py-20 space-y-4">
            <h4 className="text-secondary text-3xl md:text-6xl font-black ">
              {banners[currentIndex]?.title}
            </h4>
            <p className="text-secondary hidden md:block text-2xl font-normal">
              {banners[currentIndex]?.description ||
                banners[currentIndex]?.subtitle}
            </p>
            <button
              onClick={() => navigate(`products/${banners[currentIndex]?.category}`)}
              className="md:px-6 md:py-2 p-1 bg-secondary text-sm lg:text-xl text-black font- bold rounded-sm hover:bg-slate-100 transition"
            >
              shop
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 flex justify-center w-full space-x-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 md:h-3 md:w-3 rounded-full cursor-pointer transition-all ${
                  index === currentIndex
                    ? "bg-secondary scale-110 md:scale-125"
                    : "bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
              ></div>
            ))}
          </div>
        </>
      ) : (
        <Load />
      )}
    </div>
  );
}

export default Hero;
