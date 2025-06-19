export const Load = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full py-10 text-gray-400">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-700 opacity-20" />
          <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-l-4 border-gray-400 border-t-white" />
        </div>
        <p className="mt-4 text-sm tracking-wide text-gray-500 animate-pulse">
          Loading, please wait...
        </p>
      </div>
    );
  };
  