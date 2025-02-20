// trending page
import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import ShopContext from "../context/cart/shop-context";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function Collections() {
  const { products } = useContext(ShopContext);

  return (
    <div className="relative flex flex-col gap-10">
      <Navbar />

      <div className="bg-white mb-6 mt-6">
        <div>
          <div className="flex">
            <div className="relative group mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-0 grid-flow-row-dense">
                {products.collections?.length > 0 ? (
                  products.collections.map((p, index) => (
                    <div
                      key={p.id}
                      className={`relative h-max transition-transform transform ${
                        index % 1 === 0
                          ? "lg:col-span-2 md:col-span-1"
                          : "lg:col-span-1 md:col-span-2"
                      } 
                      ${index % 3 === 0 ? "col-span-2" : "col-span-1"}`}
                    >
                      <Link to={`/products/${p.category}`} className="block">
                        <img
                          className="w-full h-auto min-h-[20rem] md:max-h-[30rem] max-h-[20rem] object-cover"
                          src={p.imageUrl || p.image}
                          alt={p.title}
                        />

                        <div className="absolute bottom-0 flex w-full items-end h-full hover:bg-gradient-to-t from-zinc-800 to-transparent p-4 text-white">
                          <div className="relative z-10 w-full max-w-6xl px-6 text-center py-20">
                            <h2 className="text-white text-base md:text-xl md:font-extrabold lg:mb-4">
                              {p.brand}
                            </h2>
                            <h3 className="text-white text-2xl lg:text-6xl font-extrabold  lg:mb-4">
                              {p.category}
                            </h3>
                            {/* <p className="hidden text-white text-base lg:text-xl font-[100] mt-2 mb-4">
                              {p.description || p.subtitle}
                            </p> */}
                            <button className="mt-2 underline px-2 py-1 md:px-4 md:py-1 bg-white text-black font-bold rounded-sm hover:bg-gray-100">
                              Shop
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 p-6">fetching collections ...</p>
                )}
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
