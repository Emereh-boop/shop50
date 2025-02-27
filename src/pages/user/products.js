import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import Product from "../../components/products/product";
import Pagination from "../../components/common/pagination";
import Filter from "../../components/common/filterAndSort"; // Assuming the Filter component is similar
import { useProducts } from "../../context/products/context";
import { Load } from "../../components/common/loading";

const Products = () => {
  const { category } = useParams();
  const { products = {} } = useProducts();

  const [prods, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // State for filter and sorting
  const [filter, setFilter] = useState([]); // Filter options (like price ranges, categories, etc.)
  const [sortBy, setSortBy] = useState("");  // Sort by criteria (like price, date, rating)
  const [sortDirection, setSortDirection] = useState("asc"); // Sort direction (asc/desc)

  useEffect(() => {
    if (products?.products?.length > 0) {
      // Filter products based on category
      const selectedProducts = products.products.filter(
        (product) => product.category === category
      );
      setProducts(selectedProducts);
    }
  }, [category, products]);

  // Filter products based on selected filter criteria
  const filteredProducts = prods.filter((product) => {
    if (filter.length === 0) return true; // No filter applied

    return filter.every((category) => {
      // Handling Price range
      if (category.startsWith("price_")) {
        const range = category.split("_")[1]; // Get the price range part
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      }

      // Handling Category Filter
      return product.category?.toLowerCase().includes(category.toLowerCase());
    });
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortBy) return 0; // No sorting applied

    if (sortBy === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "date") {
      return sortDirection === "asc"
        ? new Date(a.timeStamp) - new Date(b.timeStamp)
        : new Date(b.timeStamp) - new Date(a.timeStamp);
    } else if (sortBy === "rating") {
      return sortDirection === "asc" ? a.rating - b.rating : b.rating - a.rating;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Slice products based on pagination
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="relative flex flex-col gap-10">
      <Navbar />

      <div className="bg-white mb-6 mt-6">
        <h2 className="text-center text-4xl font-extrabold text-black mb-8">
          {category?.toUpperCase()}
        </h2>

        <div className="mx-auto max-w-[100rem]">
          <Filter
            filter={filter}
            setFilter={setFilter}
            setSortBy={setSortBy}
            setSortDirection={setSortDirection}
          />
          <div className="relative group mx-auto">
            <div className="grid lg:grid-cols-4 lg:gap-8 md:grid-cols-3 grid-cols-2">
              {paginatedProducts?.length > 0 ? (
                paginatedProducts?.map((p) => (
                  <Product className="w-60 lg:w-[30rem]" key={p.id} product={p} />
                ))
              ) : (
                <Load/>
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

export default Products;
