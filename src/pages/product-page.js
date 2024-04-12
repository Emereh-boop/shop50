import React, { useContext } from "react";
import Footer from "../components/footer";
import backArrowIcon from "../images/back-arrow.svg";
import { Link } from "react-router-dom";
import ShopContext from "../context/cart/shop-context";

function ProductPage() {
  const { products } = useContext(ShopContext);

  return (
    <div>
      <hr />
      <main className="pb-10 p-1">
        {products.map((product, i) => {
          return (
            <div className="pl-4 pb-10 gap-8 flex flex-col md:gap-5 md:grid md:grid-cols-2">
              <div className="col-span-1 flex flex-col-reverse md:flex-row gap-2">
                <div className="flex justify-around md:grid md:grid-rows-2  md:gap-2">
                  <img
                    className="object-contain h-60"
                    src={product.image}
                    alt=""
                  />
                  <img className="object-contain " src={product.image} alt="" />
                </div>
                <img
                  className="object-contain w-4/5"
                  src={product.image}
                  alt=""
                />
              </div>
              <div className="flex flex-col col-span-1 md:gap-8 gap-4">
                <p>{product.title}</p>
                <p className="text-gray-600">${product.currentprice}.00</p>
                <div>
                  <p className="text-sm text-gray-500 p-6">Size:</p>
                  <div className="flex justify-between gap-4 p-2 w-1/2">
                    {" "}
                    {product.sizes.map((size) => {
                      return (
                        <button className="ring-2 ring-black p-2 rounded-full w-1/4">
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button className="bg-black text-white p-4 w-2/3 rounded-lg">
                  Add to cart{" "}
                </button>
                <div className="w-4/5">
                  <div className="flex justify-between py-4">
                    <p>Product Description</p> <strong>+</strong>
                  </div>
                  <div className="flex-grow border-t border-black"></div>
                </div>{" "}
                <div className="w-4/5">
                  <div className="flex justify-between py-4">
                    <p>Delivery and Payment</p> <strong>+</strong>
                  </div>
                  <div className="flex-grow border-t border-black"></div>
                </div>{" "}
                <div className="w-4/5">
                  <div className="flex justify-between py-4">
                    <p>Care recommendations</p> <strong>+</strong>
                  </div>
                  <div className="flex-grow border-t border-black"></div>
                </div>
              </div>
              <br />
            </div>
          );
        })}
        <form className="px-1 flex flex-col gap-8 md:px-80">
          <p className=" px-28 text-center">
            If you have any questions, leave a request and we will contact you.
          </p>
          <div className="flex flex-col gap-6">
            <input
              className="ring-2 ring-black p-3 rounded-lg"
              name="name"
              type="text"
              placeholder="Your name"
            />

            <input
              className="ring-2 ring-black p-3 rounded-lg"
              name="PhoneNumber"
              type="text"
              placeholder="Phone number"
            />
          </div>

          <input
            className="ring-2 ring-black bg-black text-white p-3 rounded-lg "
            type="submit"
            value={"Leave a request"}
          />
        </form>
        <Link to="/" className="flex py-10 cursor-pointer">
          <img src={backArrowIcon} alt="" /> GO BACK{" "}
        </Link>
      </main>

      <hr />
      <Footer />
    </div>
  );
}

export default ProductPage;
