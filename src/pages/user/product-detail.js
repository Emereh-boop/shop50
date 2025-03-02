import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useCart } from "../../context/cart/context";
import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import { Dash, Plus } from "react-bootstrap-icons";
import { formatCurrency } from "../../utils/format";
import { useProducts } from "../../context/products/context";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products = {} } = useProducts();
  const prod = products?.products 
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [productParam, setProductParam] = useState("");
  const [openSections, setOpenSections] = useState({
    description: true,
    features: false,
    specifications: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      description: section === "description" ? !prev.description : false,
      features: section === "features" ? !prev.features : false,
      specifications:
        section === "specifications" ? !prev.specifications : false,
    }));
  };

  const plusQty = () => {
    setQty((p) => p + 1);
  };
  const minusQty = () => {
    setQty((p) => p - 1);
  };

  useEffect(() => {
    const selectedProduct = prod?.find((product) => product.id === id);
    setProduct(selectedProduct);
    setProductParam(selectedProduct?.brand);
  }, [id, products, prod]);

  // Fallback if the product is not found
  if (!product) {
    // return window.history.back; // Go back to the previous page if product not found
    // return null;
  }

  return (
    <section className="pt-16">
      <Navbar />
      <div className="flex-col flex lg:flex-row lg:h-dvh bg-secondary gap-4 lg:gap-10">
        {/* Product Image and Gallery */}
        <div className="w-full lg:w-1/2 pl-4 lg:pl-5 rounded-md flex relative justify-between">
          <img
            className="w-full max-h-auto lg:h-dvh object-cover"
            src={product?.imageUrl || product?.image}
            alt={product?.title}
          />
          <div className="absolute top-0 left-5 w-full h-full flex flex-col gap-1 ">
            {product?.additionalImage?.map((i) => (
              <img
                key={i}
                className="w-20 lg:w-32 shadow-sm rounded-sm h-20 lg:h-32 object-contain"
                src={i}
                alt={i}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="w-full lg:w-1/2 rounded-md flex pl-4 lg:pl-5 flex-col gap-y-4 lg:gap-y-8 bg-secondary">
          <div className="flex  flex-col lg:gap-4 gap-1 ">
            <h1 className="text-2xl lg:text-3xl font-bold">{product?.title}</h1>
            <p className="text-sm text-gray-400 ">{product?.description}</p>
            <div className="price">{formatCurrency(product?.price)}</div>
            <p className="text-sm text-blue-500 ">{product?.ad}</p>
            <div className="star-rating">
              ★★★★★ <span>{product?.reviews?.length} reviews</span>
            </div>
          </div>

          {/* Product Colors and Sizes */}
          <div className="flex flex-col gap-1 lg:gap-4">
            <hr className="text-gray-100 hidden lg:block" />
            <div className="flex flex-col gap-1 lg:gap-4">
              Color(s)
              <div className="flex">
                {product?.colors?.map((c) => (
                  <div key={c.code + c.color}>
                    <input type="radio" className="hidden" />
                    <div
                      className="w-3 lg:w-6 lg:h-6 h-3 rounded-full hover:bg-opacity-50"
                      style={{ backgroundColor: c.code }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 lg:gap-4">
              Size(s)
              <div className="flex">
                {product?.sizes.map((s) => (
                  <div
                    key={s}
                    className="w-8 ml-2 lg:ml-8 h-8 hover:bg-neutral-300 rounded-sm justify-center items-center flex text-base font-bold text-black bg-neutral-200"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 h-12 lg:h-20 ">
              <div
                className={`rounded-sm bg-primary hover:bg-primary/50 p-2 flex items-center ${
                  qty === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => (qty > 1 ? minusQty() : null)}
                disabled={qty === 1}
              >
                <Dash className="h-3 lg:h-6 w-3 lg:w-6 text-white" />
              </div>
              <p className="text-primary text-lg w-6 text-center">{qty}</p>
              <div
                className="rounded-sm bg-primary hover:bg-primary/50 p-2 flex items-center"
                onClick={() => plusQty()}
              >
                <Plus className="h-3 lg:h-6 w-3 lg:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Product Description, Features, and Specifications */}
          <div className="flex flex-col gap-4">
            <hr className="text-gray-100 hidden lg:block" />
            <div>
              <div
                className="text-gray-900 font-bold uppercase text-sm lg:text-lg cursor-pointer items-center flex gap-2"
                onClick={() => toggleSection("description")}
              >
                <span>Product Description</span>
                <span className="text-base lg:text-2xl">
                  {openSections.description ? <Dash /> : <Plus />}
                </span>
              </div>
              {openSections.description && (
                <p className="text-gray-900 text-xs lg:text-base ml-5">{product?.longDescription}</p>
              )}
            </div>
            <div>
              <div
                className="font-bold text-gray-900 uppercase text-sm lg:text-lg  cursor-pointer items-center flex gap-2"
                onClick={() => toggleSection("features")}
              >
                <span>Features</span>
                <span className="text-base lg:text-2xl">
                  {openSections.features ? <Dash /> : <Plus />}
                </span>
              </div>
              {openSections.features && (
                <ul className="ml-4 list-disc text-xs lg:text-base text-gray-900">
                  {product?.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div
                className="font-bold text-gray-900 text-sm lg:text-lg  uppercase cursor-pointer items-center flex  gap-2"
                onClick={() => toggleSection("specifications")}
              >
                <span>Specifications</span>
                <span className="text-base lg:text-2xl">
                  {openSections.specifications ? <Dash /> : <Plus />}
                </span>
              </div>
              {openSections.specifications && (
                <ul className="ml-4 list-disc text-xs lg:text-base text-gray-900">
                  {product?.specifics.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div
            onClick={() => addToCart(product)}
            className="flex w-1/4 lg:w-1/5 p-1 lg:py-4 rounded-sm items-center justify-center bg-primary text-secondary"
          >
            <button>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products mb-5">
        <h3 className="p-5 text-sm lg:text-xl font-black uppercase">Related Products</h3>
        <div className="relative group mx-auto px-10 lg:px-16">
          <div className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 snap-x snap-mandatory">
            {productParam &&
            products?.products.filter((p) => p.brand === productParam).length >
              0 ? (
              products?.products
                .filter((p) => p.brand === productParam)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-28 lg:w-44 snap-start"
                  >
                    <div className="relative">
                      <img
                        className="w-full h-28 lg:h-44 object-cover transition-transform duration-300 hover:scale-105"
                        src={product.imageUrl}
                        alt={product.title}
                      />
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-400">Loading ...</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default ProductDetails;
