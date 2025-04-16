import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Product from "../../components/products/ProductCard";
import Pagination from "../../components/common/pagination";
import { useProducts } from "../../context/products/context";
import { Load } from "../../components/skeletons/loading";
import SmartFilterAndSort from "../../components/common/filterAndSort";
import { ProductCardSkeleton } from "../../components/skeletons/ProductCardSkeleton";

const Products = () => {
  const { category } = useParams();
  const { products = {} } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    const allItems = [
      ...(products?.products || []),
      ...(products?.banners || []),
    ];
  
    if (allItems.length > 0) {
      const selectedItems = allItems.filter((item) => {
        const categoryMatch = item.category?.toLowerCase() === category?.toLowerCase();
        return categoryMatch 
      });
  
      setCategoryProducts(selectedItems);
      setFilteredProducts(selectedItems);
    }
  }, [category, products]);
  

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="relative flex flex-col gap-10 group mx-auto max-w-7xl">
      <div className="bg-white mb-6 mt-6">
        <h2 className="text-center text-4xl font-extrabold text-black mb-8">
          {category?.toUpperCase()}
        </h2>

        <div className="mx-auto max-w-[100rem]">
          {/* ✅ Smart Filter Integration */}
          <SmartFilterAndSort
            data={categoryProducts}
            onFiltered={(filtered) => {
              setFilteredProducts(filtered);
              setCurrentPage(1); // Reset to page 1 on new filter
            }}
            defaultSort={{ key: "timeStamp", dir: "desc" }}
            allowedSortKeys={["price", "rating", "timeStamp", "title", "brand"]}
            customLabels={{
              title: "Name",
              price: "Price",
              rating: "Rating",
              timeStamp: "Date Added",
              brand: "Brand",
              quantity: "In Stock",
            }}
            filterExclude={[
              "id",
              "url",
              "imageUrl",
              "subtitle",
              "title",
              "longDescription",
              "shortDescription",
              "description",
            ]}
          />

          {/* ✅ Products */}
          <div className="w-full min-w-96 md:w-[48rem] lg:w-[80rem]">
            {paginatedProducts?.length > 0 ? (
              <div className="grid lg:grid-cols-4 lg:gap-1 md:grid-cols-3 grid-cols-2">
                {paginatedProducts.map((p) => (
                  <Product
                    className="w-60 lg:w-[30rem]"
                    key={p.id}
                    product={p}
                  />
                ))}
              </div>
            ) : (
              <div className="grid lg:grid-cols-4 lg:gap-1 md:grid-cols-3 grid-cols-2">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        />
      </div>
    </div>
  );
};

export default Products;
