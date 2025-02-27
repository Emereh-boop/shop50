import React from "react";
import { useProducts } from "../../context/products/context";
import { useNavigate } from "react-router-dom";

export default function CollectionComp() {
  const navigate = useNavigate();
  const { products = {} } = useProducts();
  // Assuming products have a 'category' field and other necessary fields like 'onsale', 'instock', etc.
  const allProducts = products?.products || [];

  // Step 1: Filter products (if needed)
  const filteredProducts = allProducts.filter((product) => {
    // Example filter: Only include products that are on sale and in stock
    return product.onsale && product.instock;
  });

  // Step 2: Extract unique categories for collections
  const collections = Array.from(
    new Set(filteredProducts.map((product) => product.category))
  ).map((category) => {
    // Find one product to represent the collection
    const collectionProduct = filteredProducts.find(
      (product) => product.category === category
    );
    return {
      id: category, // Using category as the id
      category,
      imageUrl: collectionProduct?.imageUrl || collectionProduct?.image,
      // You can use a representative product's image or any other logic to determine the image
    };
  });

  return (
    <div className="flex flex-auto flex-wrap mt-5">
      {collections?.map((collection) => (
        <div
          key={collection.id}
          onClick={() => navigate(`products/${collection.category}`)}
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
          </div>
        </div>
      ))}
    </div>
  );
}
