// new arrivals page
import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Product from "../components/product";
import ShopContext from "../context/cart/shop-context";
import { ChevronCompactLeft, ChevronCompactRight } from "react-bootstrap-icons";
import Filter from "../components/Filter";

export default function NewArrivals() {
  const { products } = useContext(ShopContext);
  // const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const totalPages = Math.ceil(products.newArrivals.length / productsPerPage);

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

      <div
        className="bg-white mb-6 mt-6"
        tabIndex={0} // Makes the div focusable
      >
        <h2 className="text-center text-4xl font-extrabold text-black mb-8">
          NEW<i>est</i> ARRIVALS
        </h2>
        <div className="mx-auto max-w-[100rem]">
          <Filter />
          <div className="relative group mx-auto">
            <div className=" grid lg:grid-cols-4 lg:gap-8 md:grid-cols-3 grid-cols-2">
              {products.newArrivals.length > 0 ? (
                products.newArrivals.map((p) => (
                  <Product
                    className="w-60 lg:w-[30rem] "
                    key={p.id}
                    product={p}
                  />
                ))
              ) : (
                <p className="text-gray-400 p-6">fetching new arrivals ...</p>
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
}

function Pagination({
  currentPage,
  totalPages,
  handlePageChange,
  handleNextPage,
  handlePreviousPage,
}) {
  const { products } = useContext(ShopContext);

  const productsPerPage = 20; // Keep this consistent with the parent component

  const startProduct = (currentPage - 1) * productsPerPage;
  const endProduct = Math.min(
    currentPage * productsPerPage,
    products.newArrivals.length
  );

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        <p className=" lg:block text-sm text-gray-600">
          Showing <span className="font-semibold">{startProduct}</span> to{" "}
          <span className="font-semibold">{endProduct}</span> of{" "}
          <span className="font-semibold">{products.newArrivals.length}</span>{" "}
          results
        </p>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-500 bg-white hover:bg-gray-100 focus:z-20"
          >
            <span className="sr-only">Previous</span>
            <ChevronCompactLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-100 focus:z-20 ${
                page === currentPage
                  ? "bg-zinc-600 text-white"
                  : "text-gray-900"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-500 bg-white hover:bg-gray-100 focus:z-20"
          >
            <span className="sr-only">Next</span>
            <ChevronCompactRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
}
