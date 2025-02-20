import React, { useContext, useRef, useState, useEffect } from "react";
import ShopContext from "../context/cart/shop-context";
import { ArrowRight } from "react-bootstrap-icons";

export default function NewArrivals() {
  const { products } = useContext(ShopContext);
  const sliderRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

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
      }, 3000); // Slide every 3 seconds
    }
    return () => clearInterval(autoSlide);
  }, [isFocused]);

  return (
    <div
      className="bg-white"
      tabIndex={0} // Makes the div focusable
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <h2 className="text-start text-4xl font-extrabold text-black my-5">
        NEW ARRIVALS
      </h2>

      <div className="relative group lg:px-0 mx-auto">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
        >
          {products.newArrivals?.length > 0 ? (
            products.newArrivals.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0 w-60 lg:w-[30rem] snap-start"
              >
                <div className="relative p-1">
                  <img
                    className="w-full h-60 lg:h-[35rem] ring-1 ring-primary object-cover rounded-sm transition-transform duration-500 ease-in-out"
                    src={p.imageUrl || p.image}
                    alt={p.title}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 p-6">Loading collection...</p>
          )}
        </div>
        {products.newArrivals?.length > 0 && (
          <a
            href="/new"
            className="absolute flex gap-2 lg:gap-4 items-center left-5 lg:left-10 bottom-5 lg:bottom-10 py-2 lg:py-3 border px-3 lg:px-6 rounded-sm  bg-white text-black hover:bg-gray-100 transition-colors text-center"
          >
            shop the collection <ArrowRight />
          </a>
        )}
      </div>
    </div>
  );
}
