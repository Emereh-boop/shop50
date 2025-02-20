import React from "react";
import { ChevronCompactLeft, ChevronCompactRight } from "react-bootstrap-icons";

export default function Pagination(props) {
  const productsPerPage = 20; // Keep this consistent with the parent component

  const startProduct = (props.currentPage - 1) * productsPerPage;
  const endProduct = Math.min(
    props.currentPage * productsPerPage,
    props.totalPages || 0
  );

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        <p className=" lg:block text-sm text-gray-600">
          Showing <span className="font-semibold">{startProduct}</span> to{" "}
          <span className="font-semibold">{endProduct}</span> of{" "}
          <span className="font-semibold">{props.totalPages}</span> results
        </p>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            onClick={props.handlePreviousPage}
            disabled={props.currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-500 bg-white hover:bg-gray-100 focus:z-20"
          >
            <span className="sr-only">Previous</span>
            <ChevronCompactLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {Array.from({ length: props.totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => props.handlePageChange(index + 1)}
              className={`${
                index + 1 === props.currentPage
                  ? "bg-primary text-white"
                  : "text-gray-500"
              } inline-flex items-center px-4 py-2 text-sm font-medium`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={props.handleNextPage}
            disabled={props.currentPage === props.totalPages}
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
