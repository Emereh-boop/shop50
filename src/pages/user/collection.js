import React from "react";
import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useProducts } from "../../context/products/context";
import { Load } from "../../components/common/loading";

export default function Collections() {
  const { products = {} } = useProducts();

  // Assuming products have a 'category' field and other necessary fields like 'onsale', 'instock', etc.
  const allProducts = products?.products || [];

  // Step 1: Filter products (if needed)
  const filteredProducts = allProducts.filter(product => {
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
    <div className="relative flex flex-col gap-10">
      <Navbar />

      <div className="bg-white mb-6 mt-6">
        <div>
          <div className="flex">
            <div className="relative group mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-0 grid-flow-row-dense">
                {collections?.length > 0 ? (
                  collections.map((collection, index) => (
                    <div
                      key={collection.id}
                      className={`relative h-max transition-transform transform ${
                        index % 1 === 0
                          ? "lg:col-span-2 md:col-span-1"
                          : "lg:col-span-1 md:col-span-2"
                      } 
                      ${index % 3 === 0 ? "col-span-2" : "col-span-1"}`}
                    >
                      <Link to={`/products/${collection.category}`} className="block">
                        <img
                          className="w-full h-auto min-h-[20rem] md:max-h-[30rem] max-h-[20rem] object-cover"
                          src={collection.imageUrl}
                          alt={collection.category}
                        />

                        <div className="absolute bottom-0 flex w-full items-end h-full hover:bg-gradient-to-t from-zinc-800 to-transparent p-4 text-white">
                          <div className="relative z-10 w-full max-w-6xl px-6 text-center py-20">
                            <h2 className="text-white text-base md:text-xl md:font-extrabold lg:mb-4">
                              {collection.category}
                            </h2>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <Load/>
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
