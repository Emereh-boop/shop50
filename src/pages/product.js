import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid"; // Importing XMarkIcon from Heroicons
import { Bank, CreditCard } from "react-bootstrap-icons"; // Importing icons from react-bootstrap-icons
import ShopContext from "../context/cart/shop-context"; // Importing context for cart management
import Navbar from "../components/Navbar"; // Importing Navbar component
import Footer from "../components/footer"; // Importing Footer component

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useContext(ShopContext);

  // State to store the selected product
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch the product data by ID from the products context
    const selectedProduct = products.find((product) => product.id === id);
    setProduct(selectedProduct);
  }, [id, products]);

  // Fallback if the product is not found
  if (!product) {
    return (
      <div className="text-center">
        <Navbar />
        <p> Product not found</p>
      </div>
    );
  }

  return (
    <section className="mt-16">
      <Navbar />
      <div className="flex h-700 bg-secondary gap-4">
        <div className="w-1/2 px-5 rounded-md flex flex-col justify-between">
          <img className="w-1/2" src={product.imageUrl} alt={product.title} />
          <div>
            {product.additionalImages?.map((i) => {
              return (
                <img
                  className="w-40 shadow-sm ring ring-primary rounded-sm h-40 object-contain"
                  src={i.imageUrl}
                  alt={product.title}
                />
              );
            })}
          </div>
        </div>
        <div className="w-1/2 rounded-md flex flex-col bg-secondary">
          <div>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <div className="star-rating">★★★★★</div>
            <div className="price">{product.price}</div>
          </div>
          <div>
            <h2>Product Description</h2>
            <h3>Features</h3>
            <div className="">
              <ul>
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <h3>Specifications</h3>
              <ul>
                <li>Size: {product.size}</li>
                <li>Color: {product.color}</li>
                <li>Material: {product.material}</li>
              </ul>
            </div>
          </div>
          <div>
            <button>Add to Cart</button>
          </div>
        </div>
      </div>
      <div className="related-products">
        <h3>Related Products</h3>
        {/* Display related products */}
      </div>{" "}
      <div className="customer-reviews">
        <h3>Customer Reviews</h3>

        {/* Individual customer reviews */}
      </div>
      <Footer /> {/* Render the Footer component */}
    </section>
  );
};

export default ProductDetails;
