import React, { useState } from "react";
import { Check, FilterCircleFill, SortAlphaDown } from "react-bootstrap-icons";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function Filter() {
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState(false);
  const [order, setOrder] = useState("asc");
  const [sortDirection, setSortDirection] = useState("");
  const [sortType, setSortType] = useState("");
  const sortOptions = ["price", "date", "colors"];
  const filt = filter.reduce((acc, item) => {
    // Avoid duplicate entries
    if (!acc.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);

  return (
    <div className="flex max-w-[100rem] items-center justify-between mx-auto">
      <div className="flex items-center gap-4 w-1/2 h-20">
        <div className="ring gap-1 px-2 ring-zinc-600 flex items-center rounded-sm py-1 text-white bg-zinc-600">
          <FilterCircleFill className="w-4 h-4 text-white" /> Filters
        </div>
        <div className="flex gap-2 overflow-x-auto p-2 scroll-smooth scrollbar-hide snap-x snap-mandatory ">
          {filter &&
            filt.map((p, index) => {
              return (
                <div
                  key={index + p}
                  className="ring-1 gap-1 px-2 ring-zinc-700 flex items-center rounded-sm py-1 text-primary"
                >
                  {p}{" "}
                  <XMarkIcon
                    onClick={() =>
                      setFilter((prev) => prev.filter((item) => item !== p))
                    }
                    className="w-4 h-4 text-blue-400 "
                  />
                </div>
              );
            })}
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
          <div className="z-30  top-9 left-0 py-1 absolute w-40 shadow-md rounded-sm bg-secondary ">
            <div>
              {sortOptions.map((s, index) => (
                <li
                  key={s + index}
                  onClick={() => setSortType(s)}
                  className="hover:bg-neutral-100 px-2 py-1   justify-between items-center flex"
                >
                  {s}
                </li>
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
                      order === "asc" ? "block w-6 h-5" : "hidden "
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
                      order === "desc" ? "block w-6 h-5" : "hidden "
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
  );
}
