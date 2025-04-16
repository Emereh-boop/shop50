import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/products/context";
import { motion } from "framer-motion";
import { Load } from "../../components/skeletons/loading";
import { ArrowRight } from "react-bootstrap-icons";
import { CategorySkeleton } from "../../components/skeletons/CategorySkeleton";

export default function Collections() {
  const { products = {} } = useProducts();
  const allProducts = products?.products || [];

  // Filter products and structure collections
  const filteredProducts = allProducts.filter((p) => p.onsale && p.instock);
  const collections = Array.from(
    new Set(filteredProducts.map((p) => p.category))
  ).map((category) => {
    const collectionProduct = filteredProducts.find(
      (p) => p.category === category
    );
    return {
      id: category,
      category,
      imageUrl: collectionProduct?.imageUrl || collectionProduct?.image,
    };
  });

  return (
    <div className="relative flex flex-col gap-10 mx-auto h-svh max-w-7xl mt-16">
      <h3 className="font-bold text-xl md:text-4xl self-center uppercase">
        Collections
      </h3>
      <div
        className="flex grid-cols- 3 md:grid-cols- 4 lg:grid-cols- 5 gap-1 auto-rows-auto"
        style={{ gridAutoFlow: "dense" }}
      >
        {collections.length > 0
          ? collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                className="relative flex-grow group overflow-hidden rounded-sm shadow-sm z-auto hover:scale-x- first-of-type:102"
              >
                <Link to={`/products/${collection.category}`} className="block">
                  <motion.img
                    className="w-full h-[30rem] object-cover"
                    src={collection.imageUrl}
                  alt={collection.category}
                  loading="lazy"
                  />
                  <h2 className="text-black text-lg font-medium gap-2 px-4 items-center flex">
                    {collection.category} <ArrowRight />
                  </h2>
                </Link>
              </motion.div>
            ))
          : [...Array(4)].map((_, i) => (
              <div key={i} className={`${i > 1 ? "hidden sm:block relative flex-grow group overflow-hidden" : " relative flex-grow group overflow-hidden"}`}>
                <CategorySkeleton />
              </div>
            ))}
      </div>
    </div>
  );
}
