import React, { useContext } from "react";
import ShopContext from "../context/cart/shop-context";

export default function CollectionPage() {
  const { products } = useContext(ShopContext);

  return (
    <>
      <div className="flex flex-auto h-[70vh] flex-wrap mt-5">
        {products.collections.map((collection) => (
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
      {/* <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
            <h2 className="text-2xl font-bold text-gray-900">Collections</h2>

            <div className="mt-6 grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-6">
              {collections.map((collection) => (
                <div key={collection.id} className="group relative">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <img
                      src={collection.imageUrl}
                      alt={collection.image.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-6 text-sm text-gray-500">
                    <a href={collection.href}>
                      <span className="absolute inset-0" />
                      {collection.title}
                    </a>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">
                    {collection.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
