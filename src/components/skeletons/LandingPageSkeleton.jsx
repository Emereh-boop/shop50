export const LandingPageSkeleton = () => {
  return (
    <div className="animate-pulse space-y-10 px-">
      {/* Hero */}
      <div className="bg-gray-300 h-[40vh] md:h-[70vh] w-full rounded-sm" />

      {/* Featured Products */}
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex justify-between px-2">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-[15%]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`relative animate-pulse border border-gray-200 shadow-sm rounded-sm p-   ${i > 1 ? "hidden sm:block" : ""
                }`}
            >
              <div className="bg-gray-300 h-60 w-full rounded mb-2" />
              <div className="absolute bottom-2 z-10 left-2 h-6 bg-gray-200 rounded w-1/3 mb-2" />
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex justify-between px-2">
          <div className="h-4 bg-gray-300 rounded w-1/6 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-[10%]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[0.5px] px-">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`animate-pulse border border-gray-200 shadow-sm rounded-sm p- ${i > 1 ? "hidden sm:block" : ""
                }`}
            >
              <div className="bg-gray-300 h-[24rem] w-full rounded mb-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex justify-between px-2">
          <div className="h-4 bg-gray-300 rounded w-1/6 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-[10%]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`animate-pulse border border-gray-200 shadow-sm rounded-sm p- ${i > 1 ? "hidden sm:block" : ""
                }`}
            >
              <div className="bg-gray-300 h-[24rem] w-full rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
