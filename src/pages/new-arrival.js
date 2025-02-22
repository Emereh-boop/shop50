import React, { useContext, useState } from "react";
import Navbar from "../components/layout/navbar.js";
import Footer from "../components/layout/footer.js";
import Product from "../components/products/product.js";
import Pagination from "../components/common/pagination.js";
import { Check, FilterCircleFill, SortAlphaDown } from "react-bootstrap-icons";
import { useProducts } from "../context/products/context.js";

export default function NewArrivals() {
  const { products = {} } = useProducts();
  const newArrivals = products.newArrivals || []
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

  const sortOptions = [
    "price",
    "date",
    "rating",
    "bestseller",
    "brand",
    "size",
  ];
  const filterOptions = [
    "brand",
    "category",
    "size",
    "color",
    "price",
    "instock",
    "onsale",
  ];

  const filteredProducts = newArrivals.filter((product) => {
    if (filter?.length === 0) return true; // No filter applied, show all

    return filter.some((category) => {
      if (category.startsWith("price_")) {
        const range = category.split("_")[1]; // Get the price range part
        const [min, max] = range.split("-").map(Number);
        return product.price >= min && product.price <= max;
      }

      return product.category?.toLowerCase().includes(category.toLowerCase());
    });
  });

  const totalPages = filteredProducts?.length
    ? Math.ceil(filteredProducts.length / productsPerPage)
    : 1; // Ensure the total pages are calculated dynamically

  const toggleFilter = (category) => {
    setFilter(
      (prev) =>
        prev.includes(category)
          ? prev.filter((item) => item !== category) // Remove filter
          : [...prev, category] // Add filter
    );
  };

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
        ? a.rating - b.rating
        : b.rating - a.rating;
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

  // Price range filter function
  const handlePriceRangeFilter = (min, max) => {
    setPriceRange([min, max]);

    // Instead of adding a direct price filter, you may want to remove the previous one and add the new one.
    setFilter((prev) => {
      // Remove previous price filter first
      const updatedFilter = prev.filter((item) => !item.startsWith("price_"));
      // Then add the new one
      return [...updatedFilter, `price_${min}-${max}`];
    });
  };

  return (
    <div className="relative flex flex-col gap-10">
      <Navbar />
      <div className="bg-white mb-6 mt-6" tabIndex={0}>
        <h2 className="text-center text-4xl font-extrabold text-black mb-8">
          NEW<i>est</i> ARRIVALS
        </h2>
        <div className="mx-auto max-w-[100rem]">
          <div className="flex max-w-[100rem] items-center justify-between mx-auto">
            <div className="flex items-center gap-4 w-1/2 h-20">
              <div className="relative">
                <div
                  onClick={() => setFilterToggle((p) => !p)}
                  className="ring gap-1 cursor-pointer items-center px-2 ring-neutral-600 flex rounded-sm py-1 text-white bg-zinc-600"
                >
                  <FilterCircleFill className="w-4 h-4 text-white" /> Filters
                </div>
                {filterToggle && (
                  <div className="z-30 top-9 left-0 py-1 absolute w-60 shadow-md rounded-sm bg-secondary ">
                    <div>
                      {filterOptions
                        .filter(
                          (
                            s // Filter out fields you don't want to render
                          ) =>
                            ![
                              "size",
                              "price",
                              "category",
                              "color",
                              "brand",
                            ].includes(s)
                        )
                        .map((s, index) => (
                          <div
                            key={s + index}
                            onClick={() => toggleFilter(s)}
                            className={`hover:bg-neutral-100 px-2 py-1 cursor-pointer ${
                              filter.includes(s)
                                ? "font-bold text-blue-500"
                                : ""
                            }`}
                          >
                            {s}
                          </div>
                        ))}
                      <div className="">
                        <div
                          onClick={() => setPriceFilterToggle((p) => !p)}
                          className="flex gap-1 cursor-pointer items-center px-2 py-1 rounded-sm "
                        >
                          Price
                        </div>
                        {priceFilterToggle && (
                          <div className="flex flex-col gap-1 cursor-pointer text-sm px-2 py-1 rounded-sm">
                            <label htmlFor="range">
                              Range: {`${priceRange[0]} - ${priceRange[1]}`}
                            </label>
                            <input
                              id="range"
                              type="range"
                              className={`${
                                priceRange[1] <= 1000
                                  ? "fill-blue-500 accent-blue-500  "
                                  : ""
                              } w-full h-1 rounded-sm`} // Apply blue color if altered
                              min="0"
                              max="1000"
                              step="100"
                              value={priceRange[1]}
                              onChange={(e) => {
                                const newValue = Number(e.target.value);
                                handlePriceRangeFilter(priceRange[0], newValue);
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="">
                        <div
                          onClick={() => setCategoryToggle((p) => !p)}
                          className="flex gap-1 cursor-pointer items-center px-2 py-1 rounded-sm "
                        >
                          Category
                        </div>
                        {categoryToggle && (
                          <div className="">
                            <div
                              onClick={() => toggleFilter("electronics")}
                              className={`hover:bg-neutral-100 px-2 py-1 cursor-pointer ${
                                filter.includes("electronics")
                                  ? "font-bold text-blue-500"
                                  : ""
                              }`}
                            >
                              Electronics
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="">
                        <div
                          onClick={() => setSizeToggle((p) => !p)}
                          className="flex gap-1 cursor-pointer items-center px-2 py-1 rounded-sm "
                        >
                          Size
                        </div>
                        {sizeToggle && (
                          <div className=" ">
                            <div
                              onClick={() => toggleFilter("small")}
                              className={`hover:bg-neutral-100 px-2 py-1 cursor-pointer ${
                                filter.includes("small")
                                  ? "font-bold text-blue-500"
                                  : ""
                              }`}
                            >
                              small
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div
                onClick={() => setSortBy((p) => !p)}
                className="ring-2 flex gap-1 cursor-pointer items-center ring-zinc-800 px-2 py-1 rounded-sm "
              >
                <SortAlphaDown className="h-5 w-5 text-zinc-800" /> Sort by
              </div>
              {sortBy && (
                <div className="z-30 top-9 left-0 py-1 absolute w-40 shadow-md rounded-sm bg-secondary ">
                  <div>
                    {sortOptions.map((s, index) => (
                      <div
                        key={s + index}
                        onClick={() => handleSort(s)}
                        className={`hover:bg-neutral-100 px-2 py-1 cursor-pointer ${
                          sortType === s ? "font-bold text-blue-500" : ""
                        }`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                  <hr className="m-2 border-neutral-400"></hr>
                  <div className="flex flex-col cursor-pointer">
                    <div
                      className="flex items-center pl-2 gap-2 "
                      onClick={() => setSortDirection("asc")}
                    >
                      <div className="w-5 h-5">
                        <Check
                          className={`${
                            sortDirection === "asc"
                              ? "block w-6 h-5"
                              : "hidden "
                          }`}
                        />
                      </div>
                      <p>Ascending</p>
                    </div>
                    <div
                      className=" flex items-center p-2 gap-2"
                      onClick={() => setSortDirection("desc")}
                    >
                      <div className="w-5 h-5">
                        <Check
                          className={`${
                            sortDirection === "desc"
                              ? "block w-6 h-5"
                              : "hidden "
                          }`}
                        />
                      </div>
                      <p>Descending</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products List */}
          <div className="relative group mx-auto">
            <div className=" grid lg:grid-cols-4 lg:gap-8 md:grid-cols-3 grid-cols-2">
              {sortedProducts?.length > 0 ? (
                sortedProducts.map((p) => (
                  <Product
                    className="w-60 lg:w-[30rem]"
                    key={p.id}
                    product={p}
                  />
                ))
              ) : (
                <p className="text-gray-400 p-6 h-[60vh] col-span-full  text-center">
                  No matching products found...
                </p>
              )}
            </div>
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
