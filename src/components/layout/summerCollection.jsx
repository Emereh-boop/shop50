import React, { useEffect, useState } from "react";
import { filterPromotions } from "../../utils/filterPromo"; // Import both filter functions
import { useProducts } from "../../context/products/context";

export default function Promotions() {
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [productsArray, setProducts] = useState([]);
  const { products } = useProducts()

  useEffect(() => {
    // Fetch your products (e.g., from the API or database)
    // const prod = fetchProducts('products');
    setProducts(products.products);
  }, [products]);

  useEffect(() => {
    if (productsArray?.length > 0) {
      // Apply the promotions filter
      const promotions = filterPromotions(productsArray);
      setFilteredPromotions(promotions);
    }
  }, [productsArray, products?.length]);
  if (!filteredPromotions || filteredPromotions.length === 0) {
    return null; // Nothing to render if no promotions
  }
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="md:pt-16 md:pb-16 pt-16 pb-16 lg:pt-24 lg:pb-24">
        <div className="md:relative mx-auto max-w-7xl px-4 static md:px-6 lg:px-8">
          <div className="max-w-lg">
            <h1 className="lg:text-6xl font-bold tracking-tight text-gray-900 text-4xl">
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
          <div className="mt-4 md:mt-8">
            <h2 className="text-xl md:text-3xl font-semibold text-gray-800">Special Promotions</h2>
            <div className="flex-wrap gap-1 grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2">
              {filteredPromotions.map((product) => (
                <div key={product.id} className="bg-white text-sm lg:text-xl shadow-sm space-y-2 rounded-lg p-2 w-full lg :w-1/4">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-52 md:h-64 object-cover rounded-sm"
                  />
                  <h3 className="mt- font-bold text-gray-800">{product.title}</h3>
                  <p className="mt- text-gray-600">{product.shortDescription}</p>
                  <span className="mt- text-red-500 font-semibold">Discount: {product.discount}% off</span>
                  <a
                    href={`/product/${product.id}`}
                    className="md:ml-6 inline-block bg-gray-700 text-white px-3 py-1 rounded-sm"
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
