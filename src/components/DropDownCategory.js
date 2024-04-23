import React from "react";
import { Link } from "react-router-dom";

function DropDownCategory() {
  return (
    <div className="flex flex-col md:top-12 rounded-b-sm md:left-56 w-32 py-4 bg-stone-100 ring-gray-500">
      <ul className="flex flex-col">
        <li className="hover:bg-neutral-200 p-2">All Products</li>
        <Link to="/register">
          <li className="hover:bg-neutral-200 p-2 flex gap-2">Collections</li>
        </Link>
        <Link to="/login">
          <li className=" hover:bg-neutral-200 p-2">New Arrivals</li>
        </Link>
      </ul>
    </div>
  );
}

export default DropDownCategory;
