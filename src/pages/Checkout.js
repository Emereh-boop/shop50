import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { useContext, useState } from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import ShopContext from "../context/cart/shop-context";

const CheckoutPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  const [quantity, setQuantity] = React.useState(0);
  const { removeItem, cartItem } = useContext(ShopContext);
  const { calculateDiscount } = useContext(ShopContext);

  const handleBack = () => {
    window.location.href = "/";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission (e.g., send data to server or process payment)
    console.log("Form submitted:", { name, email, address, paymentMethod });
  };

  return (
    <div className="flex sm:gap-5 md:gap-10 md:flex-col sm:flex-row">
      <h1 className=" flex justify-center sm:text-4xl md:text-8xl text-black ">
        CHECKOUT
      </h1>
      <div className="flex sm:flex-col md:flex-row justify-evenly">
        <div className="w-4/5">
          {cartItem.length === 0 ? (
            <div className="flex flex-col align-middle">
              <h1 className="text-5xl text-black text-center">
                {" "}
                CART IS EMPTY{" "}
              </h1>
              <button className=" underline hover:text-blue-500 text-xl p-2  rounded-sm">
                {" "}
                click here to add items
              </button>
            </div>
          ) : (
            cartItem.map((p, index) => {
              return (
                <ul key={p.key + index}>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:flex md:w-11/12 grid grid-cols-2 md:gap-12">
                      <img
                        className="object-contain w-28 md:w-40"
                        src={p.image}
                        alt=""
                      />
                      <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-black text-xl">
                          {p.title}
                        </h3>
                        <p>COLOR WHITE</p>
                        <p>{p.availability ? "IN STOCK" : "OUT OF STOCK"}</p>
                      </div>
                    </div>
                    <div className="flex justify-between md:w-3/5">
                      <div className="md:w-1/4 flex flex-col gap-10">
                        <select className="md:w-16 outline-none">
                          <option disabled>SIZE</option>
                          {p.sizes.map((size) => {
                            return <option key={size}>{size}</option>;
                          })}
                        </select>
                      </div>
                      <div className="md:w-1/4 flex flex-col gap-10">
                        <label htmlFor="select">QUANTITY</label>
                        <div className="flex justify-between cursor-pointer">
                          <button
                            onClick={() => {
                              setQuantity((prev) => prev - 1);
                            }}
                          >
                            -
                          </button>
                          <div className="text-sm font-bold">{quantity}</div>
                          <button
                            onClick={() => {
                              setQuantity((prev) => prev + 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="md:w-1/4 flex flex-col gap-10">
                        <label htmlFor="select">PRICE</label>
                        <div className="md:w-1/3 text-black font-bold">
                          {quantity === 0
                            ? calculateDiscount(p.prevprice, p.discount)
                            : calculateDiscount(p.prevprice, p.discount) *
                              quantity}
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => removeItem(p.key)}
                      className="flex flex-col h-1/2 w-1/12 justify-center text-2xl"
                    >
                      <XMarkIcon size={24} />
                    </div>
                  </div>
                </ul>
              );
            })
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="justify-end flex flex-col gap-4">
            <h2 className="font-bold text-black text-4xl">SUMMARY</h2>
            <div className="flex justify-between text-black font-bold">
              <p>
                <strong>TOTAL PRODUCTS </strong>
              </p>
              <strong>{cartItem.length}</strong>
            </div>
            <div className="flex justify-between">
              <p>DELIVERY</p>
              <p>FREE</p>
            </div>
            <div className="flex text-black font-bold">
              <p>
                <strong>ADD PROMO CODE </strong>
              </p>
              <strong> + </strong>
            </div>
            <div className="flex-grow border-t border-black"></div>
            <div className="flex justify-between text-black font-bold">
              <p className="underline underline-offset-2">
                <strong>CHECKOUT </strong>
              </p>
              <strong>{} </strong>
            </div>
          </div>
          <div onClick={handleBack} className="flex py-10 cursor-pointer">
            <ArrowLeft />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Address:</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Payment Method:</label>
            <select value={paymentMethod} onChange={handlePaymentMethodChange}>
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bitcoin">Bitcoin</option>
            </select>
          </div>
          <button type="submit">Place Order</button>{" "}
        </form>
      </div>
    </div>
  );
};
export default CheckoutPage;
