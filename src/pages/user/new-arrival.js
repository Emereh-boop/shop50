import React, {  useState,  } from "react";
import Navbar from "../../components/layout/navbar.js";
import Footer from "../../components/layout/footer.js";
import Product from "../../components/products/product.js";
import Pagination from "../../components/common/pagination.js";
import FilterAndSort from "../../components/common/filterAndSort.js"; // New FilterAndSort Component
import { useProducts } from "../../context/products/context.js";
import { Load } from "../../components/common/loading.jsx";

export default function NewArrivals() {
  const { products = {} } = useProducts();

  // Ensure that products?.products is an array before performing .sort()
  const newArrivals = Array.isArray(products?.products)
    ? products.products
        .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)) // Sort by date, descending
        .slice(0, 20) // Adjust the number of products displayed
    : []; // Fallback to an empty array if products is undefined or not an array

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filtered products based on category, price, etc.
  const filteredProducts = newArrivals.filter((product) => {
    if (filter.length === 0) return true; // No filter applied

    return filter.every((category) => {
      // Handling Price range
      if (category.startsWith("price_")) {
        const range = category.split("_")[1];
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      }

      // Handling Category Filter
      return product.category?.toLowerCase().includes(category.toLowerCase());
    });
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Sort logic for filtered products
  const sortedProducts = [...filteredProducts]?.sort((a, b) => {
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
  });

  return (
    <div className="relative flex flex-col gap-10">
      <Navbar />
      <div className="bg-white mb-6 mt-6">
        <h2 className="text-center text-xl lg:text-4xl font-extrabold text-black mb-8">
          NEW<i>est</i> ARRIVALS
        </h2>

        {/* Filter and Sort */}
        <FilterAndSort
          filter={filter}
          setFilter={setFilter}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
        />

        {/* Products List */}
        <div className="relative group mx-auto">
          <div className="grid lg:grid-cols-4 lg:gap-8 md:grid-cols-3 grid-cols-2">
            {sortedProducts?.length > 0 ? (
              sortedProducts.map((p) => (
                <Product
                  className="w-60 lg:w-[30rem]"
                  key={p.id}
                  product={p}
                />
              ))
            ) : (
              <Load/>
            )}
          </div>
        </div>

        {/* Pagination */}
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
}
