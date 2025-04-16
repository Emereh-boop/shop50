export const SearchSkeleton = () => {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-10 bg-gray-300 rounded-md w-full mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-300" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-300 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  