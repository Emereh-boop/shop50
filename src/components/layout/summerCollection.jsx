import React, { useEffect, useState } from "react";
import { filterPromotions } from "../../utils/filterPromo"; // Import both filter functions

export default function Promotions() {
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch your products (e.g., from the API or database)
    const fetchProducts = async () => {
      const productData = await fetch("/api/products"); // Replace with your product API call
      const products = await productData.json();
      setProducts(products);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      // Apply the promotions filter
      const promotions = filterPromotions(products);
      setFilteredPromotions(promotions);
    }
  }, [products]);

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Summer styles are finally here
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care if you live or die.
            </p>
          </div>

          {/* Trending Section
          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-gray-800">Trending Products</h2>
            <div className="flex flex-wrap gap-8">
              {filteredTrendingProducts.map((product) => (
                <div key={product.id} className="bg-white shadow-lg rounded-lg p-4 w-full lg:w-1/3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <h3 className="mt-4 text-xl font-bold text-gray-800">{product.name}</h3>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                  <a
                    href={`/product/${product.id}`}
                    className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md"
                  >
                    View Product
                  </a>
                </div>
              ))}
            </div>
          </div> */}

          {/* Promotions Section */}
          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-gray-800">Special Promotions</h2>
            <div className="flex flex-wrap gap-8">
              {filteredPromotions.map((product) => (
                <div key={product.id} className="bg-white shadow-lg rounded-lg p-4 w-full lg:w-1/3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <h3 className="mt-4 text-xl font-bold text-gray-800">{product.name}</h3>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                  <span className="mt-2 text-red-500 font-semibold">Discount: {product.discount}% off</span>
                  <a
                    href={`/product/${product.id}`}
                    className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md"
                  >
                    Shop Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
