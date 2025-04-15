import React, { useState, useMemo } from "react";
import Product from "../../components/products/product.js";
import Pagination from "../../components/common/pagination.js";
import SmartFilterAndSort from "../../components/common/filterAndSort.js"; // Updated Smart Component
import { useProducts } from "../../context/products/context.js";
import { Load } from "../../components/common/loading.jsx";

export default function NewArrivals() {
  const { products = {} } = useProducts();

  // Sort by newest
  const newArrivals = useMemo(() => {
    return Array.isArray(products?.products)
      ? [...products.products]
          .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
          .slice(0, 50)
      : [];
  }, [products]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <div className="relative flex flex-col gap-10">
      <div className="bg mt-16 mx-auto max-w-7xl">
        <h2 className="text-center text-xl lg:text-4xl font-extrabold text-black mb-8">
          NEW ARRIVALS
        </h2>

        {/* ✅ Smart Filter & Sort */}
        <SmartFilterAndSort
          data={newArrivals}
          onFiltered={(filtered) => setFilteredProducts(filtered)}
          defaultSort={{ key: "date", dir: "desc" }}
          allowedSortKeys={["price", "rating", "date", "title", "brand"]}
          excludedFields={[
            "id",
            "url",
            "imageUrl",
            "subtitle",
            "title",
            "longDescription",
            "shortDescription",
          ]}
          customLabels={{
            title: "Name",
            price: "Price",
            rating: "Rating",
            date: "Date Added",
            brand: "Brand",
            quantity: "In Stock",
          }}
          filterExclude={[
            "id",
            "url",
            "imageUrl",
            "subtitle",
            "title",
            "longDescription",
            "shortDescription",
          ]}
        />

        {/* Products List */}
        <div className="relative group mx-auto">
          <div className="grid lg:grid-cols-4 lg:gap-1 md:grid-cols-3 grid-cols-2">
            {paginatedProducts?.length > 0 ? (
              paginatedProducts.map((p) => (
                <Product className="w-60 lg:w-[30rem]" key={p.id} product={p} />
              ))
            ) : (
              <Load />
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
    </div>
  );
}
