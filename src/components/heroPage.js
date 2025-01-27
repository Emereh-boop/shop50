import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

function ShoeHeroPage() {
  const [shoes, setShoes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "banners"));
        const shoesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShoes(shoesData);
      } catch (error) {
        console.error("Error fetching banners: ", error);
      }
    };

    fetchBanners();
  }, []);

  const prevSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? shoes.length - 1 : prevIndex - 1
    );
  const nextSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === shoes.length - 1 ? 0 : prevIndex + 1
    );

  return (
    <div className="relative flex items-center justify-center min-h-[70vh] bg-black">
      {shoes.length > 0 && (
        <>
          <img
            src={shoes[currentIndex].imageUrl}
            alt={shoes[currentIndex].title}
            className="absolute inset-0 object-contain lg:object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 w-full max-w-6xl px-6 text-center py-20">
            <h2 className="text-white text-xl font-extrabold mb-4">
              {shoes[currentIndex].brand}
            </h2>
            <h3 className="text-white text-3xl lg:text-7xl font-semibold  mb-2">
              {shoes[currentIndex].title}
            </h3>
            <p className="text-white text-xl lg:text-4xl font-[100] mt-4 mb-6">
              {shoes[currentIndex].description || shoes[currentIndex].subtitle}
            </p>
            <button className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition">
              Shop Now
            </button>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 p-3 bg-gray-100/5 rounded-full text-white  font-bold focus:outline-none hover:bg-gray-700 transition"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-3 bg-gray-100/5 rounded-full text-white font-bold focus:outline-none hover:bg-gray-700 transition"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}
    </div>
  );
}

export default ShoeHeroPage;
