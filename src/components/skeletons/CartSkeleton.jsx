export const CartSkeleton = () => {
    return (
      <div className="animate-pulse space-y-6 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center border-b pb-4">
            <div className="bg-gray-300 h-20 w-20 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 w-2/3 rounded" />
              <div className="h-4 bg-gray-200 w-1/3 rounded" />
              <div className="h-4 bg-gray-100 w-1/4 rounded" />
            </div>
          </div>
        ))}
        <div className="h-10 bg-gray-300 w-1/2 rounded-md mt-6" />
      </div>
    );
  };
  