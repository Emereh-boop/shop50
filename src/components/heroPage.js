import React, { useContext, useState } from "react";
import ShopContext from "../context/cart/shop-context";

import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

function ShoeHeroPage() {
  const { products } = useContext(ShopContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const fetchBanners = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "banners"));
  //       const bannerData = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setbanner(bannerData);
  //     } catch (error) {
  //       console.error("Error fetching banners: ", error);
  //     }
  //   };

  //   fetchBanners();
  // }, []);

  const prevSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.banners.length - 1 : prevIndex - 1
    );
  const nextSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === products.banners.length - 1 ? 0 : prevIndex + 1
    );

  return (
    <div className="relative flex items-center justify-center min-h-[70vh] bg-black">
      {products.banners.length > 0 && (
        <>
          <img
            src={products.banners[currentIndex].imageUrl}
            alt={products.banners[currentIndex].title}
            className="absolute inset-0 object-cover lg:object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 w-full max-w-6xl px-6 text-center py-20">
            <h2 className="text-white text-xl font-extrabold mb-4">
              {products.banners[currentIndex].brand}
            </h2>
            <h3 className="text-white text-3xl lg:text-7xl font-semibold  mb-2">
              {products.banners[currentIndex].title}
            </h3>
            <p className="text-white text-xl lg:text-4xl font-[100] mt-4 mb-6">
              {products.banners[currentIndex].description ||
                products.banners[currentIndex].subtitle}
            </p>
            <button className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-sm hover:bg-gray-100 transition">
              Shop {products.banners[currentIndex].brand}
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

export default ShoeHeroPage;
