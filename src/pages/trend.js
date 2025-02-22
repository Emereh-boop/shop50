import React, { useContext, useState } from "react";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import Product from "../components/products/product";
import Pagination from "../components/common/pagination";
import { Check, FilterCircleFill, SortAlphaDown } from "react-bootstrap-icons";
import { useProducts } from "../context/products/context";

export default function Trending() {
  const { products = {} } = useProducts();
  const trending = products?.trending || [];
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortType, setSortType] = useState("");
  const [priceFilterToggle, setPriceFilterToggle] = useState(false);
  const [categoryToggle, setCategoryToggle] = useState(false);
  const [sizeToggle, setSizeToggle] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const sortOptions = ["price", "date", "rating", "bestseller", "brand", "size"];
  const filterOptions = ["brand", "category", "size", "color", "price", "instock", "onsale"];

  const filteredProducts = trending.filter((product) => {
    if (filter?.length === 0) return true;
    return filter.some((category) => {
      if (category.startsWith("price_")) {
        const range = category.split("_")[1];
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      }
      return product.category?.toLowerCase().includes(category.toLowerCase());
    });
  });

  const totalPages = filteredProducts?.length ? Math.ceil(filteredProducts.length / productsPerPage) : 1;

  const toggleFilter = (category) => {
    setFilter((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortType) return 0;
    if (sortType === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortType === "date") {
      return sortDirection === "asc"
        ? new Date(a.timeStamp.date) - new Date(b.timeStamp.date)
        : new Date(b.timeStamp.date) - new Date(a.timeStamp.date);
    } else if (sortType === "rating") {
      return sortDirection === "asc" ? a.rating - b.rating : b.rating - a.rating;
    }
  });

  const handleSort = (type) => {
    setSortType(type);
  };

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
      <div className="bg-white mb-6 mt-6" tabIndex={0}>
        <h2 className="text-center text-4xl font-extrabold text-black mb-8">
          TRENDING COLLECTION
        </h2>
        <div className="mx-auto max-w-[100rem]">
          <div className="flex max-w-[100rem] items-center justify-between mx-auto">
            <div className="flex items-center gap-4 w-1/2 h-20">
              <div className="relative">
                <div onClick={() => setFilterToggle((p) => !p)}
                  className="ring gap-1 cursor-pointer items-center px-2 ring-neutral-600 flex rounded-sm py-1 text-white bg-zinc-600">
                  <FilterCircleFill className="w-4 h-4 text-white" /> Filters
                </div>
              </div>
            </div>

            <div className="relative">
              <div onClick={() => setSortBy((p) => !p)}
                className="ring-2 flex gap-1 cursor-pointer items-center ring-zinc-800 px-2 py-1 rounded-sm">
                <SortAlphaDown className="h-5 w-5 text-zinc-800" /> Sort by
              </div>
            </div>
          </div>

          <div className="relative group mx-auto">
            <div className=" grid lg:grid-cols-4 lg:gap-8 md:grid-cols-3 grid-cols-2">
              {sortedProducts?.length > 0 ? (
                sortedProducts.map((p) => (
                  <Product className="w-60 lg:w-[30rem]" key={p.id} product={p} />
                ))
              ) : (
                <p className="text-gray-400 p-6 h-[60vh] col-span-full  text-center">
                  No matching products found...
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
}
