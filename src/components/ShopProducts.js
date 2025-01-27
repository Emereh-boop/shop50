import React, { useRef, useEffect, useState } from "react";
// import ShopContext from "../context/cart/shop-context";
import {
  // CartPlus,
  ChevronCompactLeft,
  ChevronCompactRight,
  // HeartFill,
} from "react-bootstrap-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Example() {
  // const { addToCart } = useContext(ShopContext);
  const sliderRef = useRef(null);

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

  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "trending"));
        const collectionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrending(collectionsData);
      } catch (error) {
        console.error("Error fetching collections: ", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="py-10 bg-white">
      <div className="text-center text-4xl font-extrabold text-black mb-8">
        TRENDING
      </div>
      <div className="relative group mx-auto max-w-[90rem] px-6 lg:px-8">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 snap-x snap-mandatory"
        >
          {trending.length > 0 ? (
            trending.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-60 sm:w-72 lg:w-80 snap-start"
              >
                <div className="relative">
                  <img
                    className="w-full h-60 lg:h-[25rem] object-cover transition-transform duration-300 hover:sale-105"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                  <span>
                    <div className="absolute bg-white p-2 bottom-4 left-1 text-sm font-medium text-gray-400">
                      ${product.price}
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
            <p className="text-gray-400">No trending products</p>
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
