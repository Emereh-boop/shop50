// components/common/filterAndSort.js
import React, { useState } from "react";
import { Check, FilterCircle, SortAlphaDown } from "react-bootstrap-icons";

const FilterAndSort = ({
  filter,
  setFilter,
  setSortBy,
  sortDirection,
  setSortDirection,
}) => {
  const [filterToggle, setFilterToggle] = useState(false);
  const [sortToggle, setSortToggle] = useState(false);
  const [sortType, setSortType] = useState("");
  const [priceFilterToggle, setPriceFilterToggle] = useState(false);
  const [categoryToggle, setCategoryToggle] = useState(false);
  const [sizeToggle, setSizeToggle] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const sortOptions = ["price", "date", "rating"];
  const filterOptions = [
    "category",
    "brand",
    "size",
    "color",
    "price",
    "instock",
    "onsale",
  ];

  const toggleFilter = (category) => {
    setFilter((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex justify-between mb-4 px-2 lg:px-4">
      {/* Filter Toggle */}
      <div className="relative">
        <button
          onClick={() => setFilterToggle(!filterToggle)}
          className="flex items-center gap-2 bg-zinc-600 text-white px-4 py-2 rounded-sm"
        >
          <FilterCircle className="w-4 h-4" /> Filters
        </button>
        {filterToggle && (
          <div className="absolute z-10 mt-2 py-2 px-4 bg-white shadow-md rounded-sm">
            {filterOptions.map((option) => (
              <div
                key={option}
                onClick={() => toggleFilter(option)}
                className={`cursor-pointer py-1 px-2 hover:bg-neutral-100 ${
                  filter.includes(option) ? "font-bold text-blue-500" : ""
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sort Toggle */}
      <div className="relative">
        <button
          onClick={() => setSortToggle(!sortToggle)}
          className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-sm"
        >
          <SortAlphaDown className="w-4 h-4" /> Sort by
        </button>
        {sortToggle && (
          <div className="absolute z-10 mt-2 py-2 px-4 bg-white shadow-md rounded-sm">
            {sortOptions.map((option) => (
              <div
                key={option}
                onClick={() => setSortBy(option)}
                className="cursor-pointer py-1 px-2 hover:bg-neutral-100"
              >
                {option}
              </div>
            ))}
            <div className="flex flex-col mt-4">
              <div
                onClick={() => setSortDirection("asc")}
                className="flex items-center gap-2"
              >
                <Check
                  className={sortDirection === "asc" ? "block" : "hidden"}
                />{" "}
                Ascending
              </div>
              <div
                onClick={() => setSortDirection("desc")}
                className="flex items-center gap-2"
              >
                <Check
                  className={sortDirection === "desc" ? "block" : "hidden"}
                />{" "}
                Descending
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterAndSort;
