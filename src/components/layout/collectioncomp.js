import React, { useContext } from "react";
import { useProducts } from "../../context/products/context";

export default function CollectionComp() {
  const { products = {} } = useProducts();
  const collections = products?.collections || []

  return (
    <div className="flex flex-auto h-[70vh] flex-wrap mt-5">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className=" md:w-1/4 h-[70vh] w-full flex-grow relative flex items-center justify-center bg-gradient-to-t from-gray-400 to-slate-50 border "
        >
          <img
            className="absolute object-cover w-full h-full"
            src={collection.imageUrl || collection.image}
            alt={collection.title}
          />

          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="pb-4 z-10 w-full max-w-6xl px-6 text-center pt-80">
            <h2 className=" text-white text-lg lg:text-xl font-extrabold">
              {collection.brand}
            </h2>
            <h1 className=" text-white text-4xl lg:text-7xl lg:font-extrabold font-extrabold">
              {collection.category}
            </h1>
            <button className="mt-3 lg:mt-6 px-4 py-1 lg:px-6 lg:py-2 bg-white text-black rounded-sm hover:bg-gray-100 ">
              Shop
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
