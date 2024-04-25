import React, { useContext } from "react";
import ShopContext from "../context/cart/shop-context";

export default function NewArrivals() {
  const { products } = useContext(ShopContext);
  return (
    <div className="bg-white">
      <div className="sm:text-4xl py-5 justify-center flex md:text-7xl">
        NEW ARRIVALS
      </div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <a key={product.key} href={product.href} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  src={product.item.image}
                  alt={product.item.title}
                  className="h-full w-full object-contain object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                {product.item.title}
              </h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {product.item.prevprice}
              </p>
            </a>
          ))}
        </div>
      </div>
      <p className="col-span-full row-span-1 text-center text-2xl cursor-pointer hover:text-blue-500 underline underline-offset-8 h-24 md:text-lg">
        SEE ALL PRODUCT
      </p>
    </div>
  );
}
