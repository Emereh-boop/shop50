import React, { useState, useEffect } from "react";
import Product from "../../components/products/product.js";
import Pagination from "../../components/common/pagination.js";
import { useProducts } from "../../context/products/context.js";
import SmartFilterAndSort from "../../components/common/filterAndSort.js";
import { Load } from "../../components/common/loading.jsx";
import { filterTrendingProducts } from "../../utils/filtertrending.jsx";

export default function Trending() {
  const { products = {} } = useProducts();
  const trending = filterTrendingProducts(products?.products || []);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    setFilteredProducts(trending);
  }, [trending]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="relative flex flex-col gap-10">
      <div className="bg mt-16 mx-auto max-w-7xl">
        <h2 className="text-center text-xl md:text-4xl font-extrabold uppercase text-black mb-8">
          Trending Products
        </h2>

        {/* ✅ Smart Filtering & Sorting */}
        <SmartFilterAndSort
          data={trending}
          onFiltered={(filtered) => {
            setFilteredProducts(filtered);
            setCurrentPage(1); // Reset page when filtering changes
          }}
          defaultSort={{ key: "timeStamp", dir: "desc" }}
          allowedSortKeys={["price", "reviewrating", "timeStamp", "brand", "title"]}
          customLabels={{
            title: "Name",
            price: "Price",
            reviewrating: "Rating",
            timeStamp: "Date Added",
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

        {/* ✅ Product Grid */}
        <div className="relative group mx-auto">
          <div className="grid lg:grid-cols-4 lg:gap-8 md:grid-cols-3 grid-cols-2">
            {paginatedProducts?.length > 0 ? (
              paginatedProducts.map((p) => (
                <Product
                  className="w-60 lg:w-[30rem]"
                  key={p.id}
                  product={p}
                />
              ))
            ) : (
              <Load />
            )}
          </div>
        </div>

        {/* ✅ Pagination */}
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
