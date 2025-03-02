import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/products/context";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import { Load } from "../../components/common/loading";

export default function Collections() {
  const { products = {} } = useProducts();
  const allProducts = products?.products || [];

  // Filter products and structure collections
  const filteredProducts = allProducts.filter((p) => p.onsale && p.instock);
  const collections = Array.from(
    new Set(filteredProducts.map((p) => p.category))
  ).map((category) => {
    const collectionProduct = filteredProducts.find((p) => p.category === category);
    return {
      id: category,
      category,
      imageUrl: collectionProduct?.imageUrl || collectionProduct?.image,
    };
  });

  return (
    <div className="relative flex flex-col gap-10">
      <Navbar />

      <div className="bg-white mb-6 mt-6 px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 auto-rows-auto"
             style={{ gridAutoFlow: "dense" }}> 
          {collections.length > 0 ? (
            collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                className="relative  group overflow-hidden rounded-sm shadow-sm z-auto hover:scale-x-102"
              >
                <Link to={`/products/${collection.category}`} className="block">
                  <motion.img
                    className="w-full h-auto object-cover"
                    src={collection.imageUrl}
                    alt={collection.category}
                  />
                  {/* Floating Title in the Middle */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h2 className="text-white text-lg font-semibold px-4">
                      {collection.category}
                    </h2>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <Load />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
