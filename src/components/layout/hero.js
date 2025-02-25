import React, {  useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/products/context";

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
    }, 3000);

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
    <div className="relative flex items-center justify-center min-h-[40vh] lg:min-h-[80vh] bg-black">
      {banners?.length > 0 && (
        <>
          <img
            src={banners[currentIndex].imageUrl}
            alt={banners[currentIndex].title}
            className="absolute inset-0 object-cover object-center w-full h-full"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Text Content */}
          <div className="relative w-full md:max-w-6xl px-1 md:px-6 text-center md:py-20 space-y-5">
            <h2 className="text-secondary hidden md:block text-2xl font-extrabold">
              {banners[currentIndex].brand}
            </h2>
            <h3 className="text-secondary text-xl md:text-7xl font-black ">
              {banners[currentIndex].title}
            </h3>
            <p className="text-secondary hidden md:block text-4xl font-thin">
              {banners[currentIndex].description || banners[currentIndex].subtitle}
            </p>
            <button
              onClick={() => handleNavigation(banners[currentIndex]?.href)}
              className="md:px-6 md:py-2 px-4 py-1 underline bg-secondary text-black font-bold rounded-sm hover:bg-slate-100 transition"
            > 
              Shop
            </button>
          </div>

          {/* Previous & Next Buttons */}
          {/* <div
            onClick={prevSlide}
            className="absolute md:left-6 left-0 top-1/2 transform -translate-y-1/2 p-3 md:bg-gray-100/5 rounded-sm text-secondary font-black hover:bg-gray-700 transition cursor-pointer"
          >
            <ChevronLeft size={34} />
          </div>
          <div
            onClick={nextSlide}
            className="absolute md:right-6 right-0 top-1/2 transform -translate-y-1/2 p-3 md:bg-gray-100/5 rounded-sm text-secondary font-black hover:bg-gray-700 transition cursor-pointer"
          >
            <ChevronRight size={34} />
          </div> */}

          {/* Dots Indicator */}
          <div className="absolute bottom-6 flex justify-center w-full space-x-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full cursor-pointer transition-all ${
                  index === currentIndex ? "bg-secondary scale-125" : "bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Hero;
