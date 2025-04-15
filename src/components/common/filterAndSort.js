import React, { useEffect, useMemo, useState } from "react";
import { Check, FilterCircle, SortAlphaDown } from "react-bootstrap-icons";

const isFilterableValue = (val) =>
  typeof val === "string" || typeof val === "boolean";
const isNumeric = (val) => typeof val === "number";
const isSortableValue = (val) =>
  typeof val === "number" || typeof val === "string" || val instanceof Date;

const LOCAL_STORAGE_KEY = "smartFilterSettings";

const SmartFilterAndSort = ({
  data = [],
  onFiltered,
  defaultSort = { key: "", dir: "asc" },
  filterExclude = [
    "name",
    "longDescription",
    "imageUrl",
    "url",
    "id",
    "subtitle",
  ],
  sortExclude = [
    "id",
    "url",
    "imageUrl",
    "subtitle",
    "category",
    "longDescription",
    "shortDescription",
  ],
  customLabels = {},
}) => {
  const [filterToggle, setFilterToggle] = useState(false);
  const [sortToggle, setSortToggle] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [rangeFilters, setRangeFilters] = useState({});
  const [sortBy, setSortBy] = useState(defaultSort.key || "");
  const [sortDirection, setSortDirection] = useState(defaultSort.dir || "asc");
  const [expandedFilters, setExpandedFilters] = useState({});

  const keys = useMemo(
    () => (Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : []),
    [data]
  );

  const filterableKeys = useMemo(
    () =>
      keys.filter(
        (key) => !filterExclude.includes(key) && isFilterableValue(data[0][key])
      ),
    [keys, filterExclude]
  );

  const sortableKeys = useMemo(
    () =>
      keys.filter(
        (key) => !sortExclude.includes(key) && isSortableValue(data[0][key])
      ),
    [keys, sortExclude]
  );

  const numericKeys = useMemo(
    () => keys.filter((key) => isNumeric(data[0][key])),
    [keys]
  );

  const uniqueFilterOptions = useMemo(() => {
    const options = {};
    filterableKeys.forEach((key) => {
      options[key] = [...new Set(data.map((item) => item[key]))];
    });
    return options;
  }, [filterableKeys, data]);

  const rangeOptions = useMemo(() => {
    const ranges = {};
    numericKeys.forEach((key) => {
      const values = data
        .map((item) => Number(item[key]))
        .filter((v) => !isNaN(v));
      if (values.length) {
        ranges[key] = {
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    });
    return ranges;
  }, [numericKeys, data]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setActiveFilters(parsed.activeFilters || {});
      setRangeFilters(parsed.rangeFilters || {});
      setSortBy(parsed.sortBy || defaultSort.key);
      setSortDirection(parsed.sortDirection || defaultSort.dir);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ activeFilters, rangeFilters, sortBy, sortDirection })
    );
  }, [activeFilters, rangeFilters, sortBy, sortDirection]);

  const toggleFilter = (key, value) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const toggleExpand = (key) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values?.length > 0) {
        result = result.filter((item) => values.includes(item[key]));
      }
    });

    Object.entries(rangeFilters).forEach(([key, range]) => {
      result = result.filter((item) => {
        const value = Number(item[key]);
        return value >= range.min && value <= range.max;
      });
    });

    if (sortBy) {
      result.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (typeof valA === "string") {
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }
      });
    }

    return result;
  }, [data, activeFilters, rangeFilters, sortBy, sortDirection]);

  useEffect(() => {
    onFiltered(filteredAndSortedData);
  }, [filteredAndSortedData, onFiltered]);

  return (
    <div className="flex justify-between mb-4 px-2 lg:px-4">
      {/* Filter */}
      <div className="relative">
        <button
          onClick={() => setFilterToggle(!filterToggle)}
          className="flex items-center gap-2 bg-zinc-600 text-white px-4 py-2 rounded-sm"
        >
          <FilterCircle className="w-4 h-4" /> Filters
        </button>
        {filterToggle && (
          <div className="absolute z-10 mt-2 py-2 px-4 bg-white shadow-md rounded-sm max-h-[500px] overflow-y-auto w-[320px]">
            {Object.entries(uniqueFilterOptions).map(([key, values]) => {
              const showAll = expandedFilters[key];
              const displayValues = showAll ? values : values.slice(0, 5);

              return (
                <div key={key} className="mb-2">
                  <p className="font-bold mb-1 capitalize">
                    {customLabels[key] || key}
                  </p>
                  {displayValues.map((val) => (
                    <div
                      key={val}
                      onClick={() => toggleFilter(key, val)}
                      className={`cursor-pointer py-1 px-2 hover:bg-neutral-100 rounded ${
                        activeFilters[key]?.includes(val)
                          ? "font-bold text-blue-500"
                          : ""
                      }`}
                    >
                      {String(val)}
                    </div>
                  ))}
                  {values.length > 5 && (
                    <button
                      className="text-sm text-blue-600 hover:underline mt-1"
                      onClick={() => toggleExpand(key)}
                    >
                      {showAll ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              );
            })}

            {/* Range Filters */}
            {Object.entries(rangeOptions).map(([key, { min, max }]) => (
              <div key={key} className="mt-4">
                <p className="font-semibold capitalize">
                  {customLabels[key] || key}
                </p>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step="1"
                  value={rangeFilters[key]?.min ?? min}
                  onChange={(e) =>
                    setRangeFilters((prev) => ({
                      ...prev,
                      [key]: {
                        ...(prev[key] || {}),
                        min: Number(e.target.value),
                      },
                    }))
                  }
                />
                <input
                  type="range"
                  min={min}
                  max={max}
                  step="1"
                  value={rangeFilters[key]?.max ?? max}
                  onChange={(e) =>
                    setRangeFilters((prev) => ({
                      ...prev,
                      [key]: {
                        ...(prev[key] || {}),
                        max: Number(e.target.value),
                      },
                    }))
                  }
                />
                <div className="text-sm text-gray-600">
                  {rangeFilters[key]?.min ?? min} -{" "}
                  {rangeFilters[key]?.max ?? max}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="relative">
        <button
          onClick={() => setSortToggle(!sortToggle)}
          className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-sm"
        >
          <SortAlphaDown className="w-4 h-4" /> Sort by
        </button>
        {sortToggle && (
          <div className="absolute z-10 mt-2 py-2 px-4 bg-white shadow-md rounded-sm">
            {sortableKeys.map((key) => (
              <div
                key={key}
                onClick={() => setSortBy(key)}
                className={`cursor-pointer py-1 px-2 hover:bg-neutral-100 ${
                  sortBy === key ? "text-blue-600 font-bold" : ""
                }`}
              >
                {customLabels[key] || key}
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

export default SmartFilterAndSort;
