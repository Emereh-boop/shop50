import React from "react";

export default function Collections() {
  return (
    <>
      <div className="grid grid-flow-row-dense md:grid-cols-4 gap-4 px-3 md:px-20">
        <div className="font-bold col-span-full row-span-1 text-4xl py-8 justify-center grid md:text-8xl">
          EXPLORE COLLECTIONS
        </div>
        <div className="md:col-span-4 bg-gray-200 h-400 md:h-700"></div>
        <div className="md:col-span-2 bg-gray-200 h-400"></div>
        <div className="md:col-span-2 bg-gray-200 h-400"></div>
        <p className="col-span-full row-span-1 text-center text-2xl underline underline-offset-8 h-24 md:text-lg">
          SEE ALL COLLECTIONS
        </p>
      </div>
    </>
  );
}
