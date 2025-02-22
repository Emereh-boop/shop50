import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import Product from "../components/products/product";
import Pagination from "../components/common/pagination";
import Filter from "../components/common/filter";
import { useProducts } from "../context/products/context";

const CollectionProducts = () => {
  const { category } = useParams();
  const { products = {} } = useProducts();

  const [prods, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    if (products?.products?.length > 0) {
      // Filter products based on category
      const selectedProducts = products.products.filter(
        (product) => product.category === category
      );
      setProducts(selectedProducts);
    }
  }, [category, products]);

  const totalPages = Math.ceil(prods.length / productsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Slice products based on pagination
  const paginatedProducts = prods.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="relative flex flex-col gap-10">
      <Navbar />

      <div className="bg-white mb-6 mt-6">
        <h2 className="text-center text-4xl font-extrabold text-black mb-8">
          {category.toUpperCase()}
        </h2>
        <div className="mx-auto max-w-[100rem]">
          <Filter />
          <div className="relative group mx-auto">
            <div className=" grid lg:grid-cols-4 lg:gap-8 md:grid-cols-3 grid-cols-2">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => (
                  <Product
                    className="w-60 lg:w-[30rem]"
                    key={p.id}
                    product={p}
                  />
                ))
              ) : (
                <p className="text-gray-400 p-6">
                  No products found in this category.
                </p>
              )}
            </div>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        />
      </div>

      <Footer />
    </div>
  );
};



export default CollectionProducts;
