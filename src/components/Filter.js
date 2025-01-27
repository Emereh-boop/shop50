import React, { useContext, useState, useEffect } from "react";
import ShopContext from "../context/cart/shop-context";
import { FilterSquare, Search } from "react-bootstrap-icons";

export default function Filter() {
  const { products } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      // Filtering locally stored products for faster results
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilter(filtered);
    } else {
      setFilter(products); // Show all products if searchTerm is empty
    }
  }, [searchTerm, products]);
  return (
    <div className="hidden space-y-6 p-5 lg:block lg:w-1/5 shadow-md">
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg flex items-center gap-2 ">
          <FilterSquare className="text-gray-400 h-9 w-9" /> Filters
        </p>
        <p className="text-sm text-gray-900">Load</p>
      </div>
      <div>
        <div className="relative hidden lg:block">
          <div className="flex items-center rounded-sm ring-[0.5px] ring-gray-900 px-3 py-1.5">
            <Search className="w-5 h-4 " />
            <input
              className="bg-transparent border-0  text-gray-700 placeholder-gray-400 focus:ring-0 focus:outline-none pl-2"
              type="search"
              name="search"
              value={searchTerm}
              placeholder="Filter collection"
              onInput={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg">
              <ul className="py-1">
                {filter.length > 0 ? (
                  filter.map((l, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {l.title}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-700">
                    No results found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* <div>list of filter</div> */}
    </div>
  );
}
