import React, { useState } from "react";
import Navbar from "../../components/layout/navbar.js";
import Footer from "../../components/layout/footer.js";
import Product from "../../components/products/product.js";
import Pagination from "../../components/common/pagination.js";
import { useProducts } from "../../context/products/context.js";
import FilterSortComponent from "../../components/common/filterAndSort.js";
import { Load } from "../../components/common/loading.jsx";
import { filterTrendingProducts } from "../../utils/filtertrending.jsx";

export default function Trending() {
  const { products = {} } = useProducts();

    const trending = filterTrendingProducts(products?.products || []); // Default to empty array if no products are available
  const productsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort states for the FilterSortComponent
  const [filt, setFilt] = useState([]);
  const [sortType, setSortType] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredProducts = trending.filter((product) => {
    if (filt?.length === 0) return true; // No filter applied, show all
    return filt.some((category) => {
      if (category.startsWith("price_")) {
        const range = category.split("_")[1]; // Get the price range part
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      }

      return product.category?.toLowerCase().includes(category.toLowerCase());
    });
  });

  const totalPages = filteredProducts.length
    ? Math.ceil(filteredProducts.length / productsPerPage)
    : 1;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortType) return 0; // No sorting applied

    if (sortType === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortType === "date") {
      return sortDirection === "asc"
        ? new Date(a.timeStamp.date) - new Date(b.timeStamp.date)
        : new Date(b.timeStamp.date) - new Date(a.timeStamp.date);
    } else if (sortType === "rating") {
      return sortDirection === "asc"
        ? a.reviewrating - b.reviewrating
        : b.reviewrating - a.reviewrating;
    }
  });

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

  return (
    <div className="relative flex flex-col gap-10">
      <Navbar />
      <div className="bg-white mb-6 mt-6">
        <h2 className="text-center text-4xl font-extrabold text-black mb-8">
          Trending Products
        </h2>

        {/* Filter and Sort */}
        <FilterSortComponent
          filter={filt}
          setFilter={setFilt}
          sortType={sortType}
          setSortType={setSortType}
          sortDirection={sortDirection}
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
