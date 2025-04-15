import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useCart } from "../../context/cart/context";
import { Dash, Plus } from "react-bootstrap-icons";
import { formatCurrency } from "../../utils/format";
import { useProducts } from "../../context/products/context";
import { Load } from "../../components/common/loading";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products = {} } = useProducts();
  const prod = products?.products;
  const [product, setProduct] = useState(null);
  const [productParam, setProductParam] = useState("");

  // State to manage the product's selected quantity, size, and color
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [openSections, setOpenSections] = useState({
    description: true,
    features: false,
    specifications: false,
  });

  // Fetch product details based on product ID
  useEffect(() => {
    const selectedProduct = prod?.find((product) => product.id === id);
    setProduct(selectedProduct);
    setProductParam(selectedProduct?.brand);
  }, [id, products, prod]);

  // Function to toggle sections (description, features, specifications)
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...Object.keys(prev).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      ),
      [section]: !prev[section],
    }));
  };

  // Function to handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    addToCart({
      ...product,
      qty: quantity,
      selectedSize,
      selectedColor,
    });
  };

  // If product is not found, show nothing or return to the previous page
  if (!product) {
    return null; // You can customize this to show a "Product not found" message
  }

  return (
    <section className="pt-16">
      <div className="flex-col flex lg:flex-row lg:h-dvh bg-secondary gap-4 lg:gap-10">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 pl-4 lg:pl-5 rounded-md flex relative justify-between">
          <img
            className="w-full max-h-auto lg:h-dvh object-cover"
            src={product?.imageUrl || product?.image}
            alt={product?.title}
          />
          <div className="absolute top-0 left-5 w-full h-full flex flex-col gap-1">
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

        {/* Product Info */}
        <div className="w-full lg:w-1/2 rounded-md flex pl-4 lg:pl-5 flex-col gap-y-4 lg:gap-y-8 bg-secondary">
          <div className="flex flex-col lg:gap-4 gap-1">
            <h1 className="text-2xl lg:text-3xl font-bold">{product?.title}</h1>
            <p className="text-sm text-gray-400">{product?.description}</p>
            <div className="price">{formatCurrency(product?.price)}</div>
            <p className="text-sm text-blue-500">{product?.ad}</p>
          </div>

          {/* Size Selector */}
          <div className="flex flex-col gap-1 lg:gap-4">
            Size(s)
            <div className="flex flex-wrap gap-2">
              {product?.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-10 h-10 rounded-sm justify-center items-center flex text-base font-bold ${
                    selectedSize === s
                      ? "bg-primary text-white"
                      : "bg-neutral-200 text-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector (optional) */}
          <div className="flex flex-col gap-1 lg:gap-4">
            Color(s)
            <div className="flex gap-2">
              {product?.colors?.map((c) => (
                <div
                  key={c.code}
                  onClick={() => setSelectedColor(c.code)}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                    selectedColor === c.code
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.code }}
                ></div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2 h-12 lg:h-20">
            <button
              className={`rounded-sm bg-primary hover:bg-primary/50 p-2 ${
                quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity === 1}
            >
              <Dash className="h-3 lg:h-6 w-3 lg:w-6 text-white" />
            </button>
            <p className="text-primary text-lg w-6 text-center">{quantity}</p>
            <button
              className="rounded-sm bg-primary hover:bg-primary/50 p-2"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-3 lg:h-6 w-3 lg:w-6 text-white" />
            </button>
          </div>

          {/* Description / Features / Specs */}
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
                <p className="text-gray-900 text-xs lg:text-base ml-5">
                  {product?.longDescription}
                </p>
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
                className="font-bold text-gray-900 text-sm lg:text-lg uppercase cursor-pointer items-center flex gap-2"
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
            onClick={handleAddToCart}
            className="flex w-1/4 lg:w-1/5 p-1 lg:py-4 rounded-sm items-center justify-center bg-primary text-secondary cursor-pointer"
          >
            <button>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products mb-5">
        <h3 className="p-5 text-sm lg:text-xl font-black uppercase">
          Related Products
        </h3>
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
                    className="flex-shrink-0 h-full w-60 lg:w-64 snap-center"
                  >
                    <Load product={product} />
                  </div>
                ))
            ) : (
              <p>No related products found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
