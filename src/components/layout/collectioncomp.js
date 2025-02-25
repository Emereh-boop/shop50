import React from "react";
import { useProducts } from "../../context/products/context";
import { useNavigate } from "react-router-dom";

export default function CollectionComp() {
  const navigate = useNavigate()
  const { products = {} } = useProducts();
  const collections = products?.collections || []

  return (
    <div className="flex flex-auto flex-wrap mt-5">
      {collections?.map((collection) => (
        <div
          key={collection.id}
          className=" lg:w-1/4 h-[40vh] lg:h-[70vh] w-full flex-grow relative flex items-center justify-center bg-gradient-to-t from-gray-400 to-slate-50 border "
        >
          <img
            className="absolute object-cover object-top h-full w-full"
            src={collection.imageUrl || collection.image}
            alt={collection.title}
          />

          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="z-10 w-full max-w-6xl px-6 text-center ">
            <h2 className=" text-white text-lg lg:text-xl font-extrabold">
              {collection.brand}
            </h2>
            <h1 className=" text-white text-4xl lg:text-7xl lg:font-extrabold font-extrabold">
              {collection.category}
            </h1>
            <button onClick={()=> navigate('collections')} className="mt-3 lg:mt-6 px-4 py-1 lg:px-6 lg:py-2 bg-white text-black rounded-sm hover:bg-gray-100 ">
              Shop
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
