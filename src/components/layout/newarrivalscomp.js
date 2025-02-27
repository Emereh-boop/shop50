import React, { useRef, useState, useEffect } from "react";
import { ArrowRight } from "react-bootstrap-icons";
import { useProducts } from "../../context/products/context";
import { useNavigate } from "react-router-dom";
import { Load } from "../common/loading";

export default function NewArrivalsComp() {
  const { products = {} } = useProducts();
  const newArrivals = Array.isArray(products?.products)
    ? products.products
        .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)) // Sort by date, descending
        .slice(0, 20) // Adjust the number of products displayed
    : []; // Fallback to an empty array if products is undefined or not an array
  
  const sliderRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const slideRight = () => {
    if (
      sliderRef.current.scrollLeft + sliderRef.current.clientWidth >=
      sliderRef.current.scrollWidth
    ) {
      sliderRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      sliderRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // const slideLeft = () => {
  //   sliderRef.current.scrollBy({
  //     left: -300,
  //     behavior: "smooth",
  //   });
  // };

  useEffect(() => {
    let autoSlide;
    if (isFocused) {
      autoSlide = setInterval(() => {
        slideRight();
      }, 3000); // Slide every 5 seconds
    }
    return () => clearInterval(autoSlide);
  }, [isFocused]);

  return (
    <div
      className="md:px-4 mt-16"
      tabIndex={0} // Makes the div focusable
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <h2 className="text-start text-xl lg:text-4xl font-extrabold text-black px-4 lg:px-1 my-5">
        NEW ARRIVALS
      </h2>

      <div className="relative group px-0 lg:px-0 mx-auto">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
        >
          {newArrivals?.length > 0 ? (
            newArrivals.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 w-60 lg:w-[30rem] snap-start"
              >
                <div className="relative">
                  <img
                    className="w-full h-60 object-center lg:h-[35rem] lg:ring-1 ring-gray-700 object object-cover rounded-sm transition-transform duration-500 ease-in-out"
                    src={p.imageUrl || p.image}
                    alt={p.title}
                  />
                </div>
              </div>
            ))
          ) : (
            <Load/>
          )}
        </div>
        {products.newArrivals && (
          <button
            onClick={() => navigate("/new")}
            className="absolute flex gap-2 lg:gap-4 items-center left-5 lg:left-10 bottom-5 lg:bottom-10 py-2 lg:py-3 border px-3 lg:px-6 rounded-sm bg-white text-black hover:bg-gray-100 transition-colors text-center"
          >
            shop the collection <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}
