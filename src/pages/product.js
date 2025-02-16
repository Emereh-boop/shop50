import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import ShopContext from "../context/cart/shop-context"; // Importing context for cart management
import Navbar from "../components/Navbar"; // Importing Navbar component
import Footer from "../components/footer"; // Importing Footer component
import { Plus } from "react-bootstrap-icons";
import { MinusIcon } from "@heroicons/react/24/outline";

const ProductDetails = () => {
  const { id } = useParams();
  const { products, formatCurrency, addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [productParam, setProductParam] = useState("");

  const [openSections, setOpenSections] = useState({
    description: false,
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
    return setQty((p) => p + 1);
  };
  const minusQty = () => {
    return setQty((p) => p - 1);
  };

  useEffect(() => {
    const selectedProduct = products.products.find(
      (product) => product.id === id
    );
    setProduct(selectedProduct);
    setProductParam(product?.brand);
  }, [id, products, product]);

  // Fallback if the product is not found
  if (!product) {
    return window.history.back;
  }

  return (
    <section className="pt-16">
      <Navbar />
      <div className="flex h-dvh bg-secondary gap-4">
        <div className="w-1/2 pl-5 rounded-md flex relative justify-between">
          <img
            className="w-full h-dvh object-cover"
            src={product.imageUrl || product.image}
            alt={product.title}
          />
          <div className="absolute top-0 left-5 w-full h-full flex flex-col gap-1 ">
            {product.additionalImages?.map((i) => {
              return (
                // <img
                //   className="w-32 shadow-sm rounded-sm h-32 object-contain"
                //   src={i.imageUrl || i.image}
                //   alt={i.title}
                // />

                <div>{i}</div>
              );
            })}
          </div>
        </div>
        <div className="w-1/2 rounded-md flex flex-col gap-y-10 bg-secondary">
          <div className="flex  flex-col gap-4 ">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-sm text-gray-400 ">{product.description}</p>
            <div className="price">{formatCurrency(product.price)}</div>
            <p className="text-sm text-blue-500 ">
              {product.ad} example ad for product
            </p>
            <div className="star-rating">
              ★★★★★ <span>{product.reviews?.lenght}reviews</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 ">
            <hr className="text-gray-100"></hr>
            <div className="flex flex-col gap-4">
              Color(s) {product.colors.color}
              <div>
                <input type="radio" className="hidden" />
                <div className="w-6 h-6 bg-black rounded-full hover:bg-black/50"></div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              Size(s)
              <div className="flex">
                {product.sizes.map((s) => (
                  <div
                    key={s}
                    className="w-8 ml-8 h-8 hover:bg-neutral-300 rounded-sm justify-center items-center flex text-base font-bold text-black bg-neutral-200"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 h-20 ">
              <div
                className="rounded-sm bg-primary hover:bg-primary/50 p-2 flex items-center"
                onClick={() => (qty === 1 ? "" : minusQty())}
              >
                <MinusIcon className="h-6 w-6 text-white " />
              </div>
              <p className="text-primary text-lg w-6 text-center">{qty}</p>
              <div
                className="rounded-sm bg-primary hover:bg-primary/50 p-2 flex items-center"
                onClick={() => plusQty()}
              >
                <Plus className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <hr className="text-gray-100" />
            <div>
              <div
                className="text-gray-900 font-bold uppercase text-lg cursor-pointer items-center flex gap-10"
                onClick={() => toggleSection("description")}
              >
                <span>Product Description</span>
                <span className="text-2xl">
                  {openSections.description ? <Plus /> : <Plus />}
                </span>
              </div>
              {openSections.description && (
                <p className="text-gray-900 ml-5">{product.longDescription}</p>
              )}
            </div>
            <div>
              <div
                className="font-bold text-gray-900 uppercase text-lg cursor-pointer items-center flex gap-10"
                onClick={() => toggleSection("features")}
              >
                <span>Features</span>
                <span className="text-2xl">
                  {openSections.features ? <Plus /> : <Plus />}
                </span>
              </div>
              {openSections.features && (
                <ul className="ml-4 list-disc text-gray-900">
                  {product.features.map((feature, index) => (
                    <li className="ml-5" key={index}>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div
                className="font-bold text-gray-900 text-lg uppercase cursor-pointer items-center flex gap-10"
                onClick={() => toggleSection("specifications")}
              >
                <span>Specifications</span>
                <span className="text-2xl">
                  {openSections.specifications ? <Plus /> : <Plus />}
                </span>
              </div>
              {openSections.specifications && (
                <ul className="ml-4 list-disc text-gray-900">
                  {product.specifics.map((spec, index) => (
                    <li className="ml-5" key={index}>
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div
            onClick={() => addToCart(product)}
            className="flex w-1/5 py-4  rounded-sm items-center justify-center bg-primary text-secondary"
          >
            <button>Add to Cart</button>
          </div>
        </div>
      </div>
      <div className="related-products mb-5">
        <h3 className="p-5 text-xl font-black uppercase">Related Products</h3>
        <div className="relative group mx-auto max-w-[90rem] px-6 lg:px-8">
          <div className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 snap-x snap-mandatory">
            {
              (products.products.brand = productParam ? (
                products.products.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-60 sm:w-72 lg:w-80 snap-start"
                  >
                    <div className="relative">
                      <img
                        className="w-full h-60 lg:h-[25rem] object-cover transition-transform duration-300 hover:sale-105"
                        src={product.imageUrl}
                        alt={product.title}
                      />
                      <span>
                        <div className="absolute bg-white p-2 bottom-4 left-1 text-sm font-medium text-gray-400">
                          {formatCurrency(product.price)}
                        </div>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Loading ...</p>
              ))
            }
          </div>
        </div>
      </div>
      {/* <div className="customer-reviews">
        <h3>Customer Reviews</h3>

         Individual customer reviews 
      </div> */}
      <Footer />
    </section>
  );
};

export default ProductDetails;
