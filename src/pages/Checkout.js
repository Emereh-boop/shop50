import React, { useContext, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid"; // Importing XMarkIcon from Heroicons
import { Bank, CreditCard } from "react-bootstrap-icons"; // Importing icons from react-bootstrap-icons
import ShopContext from "../context/cart/shop-context"; // Importing context for cart management
import Navbar from "../components/Navbar"; // Importing Navbar component
import Footer from "../components/footer"; // Importing Footer component

const CheckoutPage = () => {
  const countries = [
    {
      name: "United States",
      cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    },
    {
      name: "Canada",
      cities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Ottawa"],
    },
    {
      name: "United Kingdom",
      cities: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool"],
    },
    {
      name: "Nigeria",
      cities: ["Abuja", "Lagos", "Port-Harcourt", "Enugu", "Delta"],
    },
  ];

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const {
    removeItem,
    clearCart,
    formatCurrency,
    memoizedCartItems = [],
  } = useContext(ShopContext);

  const cart = memoizedCartItems.reduce(
    (acc, item) => {
      // Check if the item id has already been added to the cart
      const existingItem = acc.cart.find((cartItem) => cartItem.id === item.id);

      if (!existingItem) {
        // If the item is new, add it to the cart
        acc.cart.push({ ...item, qty: item.quantity });
      } else {
        // If the item already exists, increase the quantity
        existingItem.qty += item.quantity;
      }

      return acc;
    },
    { cart: [] } // Start with an empty cart
  ).cart;

  const subt = cart.reduce(
    (acc, item) => acc + Number(item.qty) * Number(item.price),
    0
  );

  const shipping = 0;
  const coupon = 0;

  const tot = subt + (shipping - coupon);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const orderData = {
      name,
      lastName,
      tel,
      email,
      address,
      zipCode,
      selectedCity,
      selectedCountry,
      deliveryMethod,
      paymentMethod,
      itemsInCart: cart,
      subt,
      shipping,
      tot,
    };

    const itemsList = orderData.itemsInCart
      .map((item) => `- ${item.title} x ${item.qty}`)
      .join("\n");

    const whatsappMessage = `
    New Order
    Customer Name: ${orderData.name} ${orderData.lastName}
    Phone: ${orderData.tel}
    Email: ${orderData.email}
    Address: ${orderData.address}
    Zipcode: ${orderData.zipCode}
    City: ${orderData.selectedCity}
    Country: ${orderData.selectedCountry}
    Payment Method: ${orderData.paymentMethod}
    Delivery Method: ${orderData.deliveryMethod}
    Subtotal: ${orderData.subt}
    Shipping: ${orderData.shipping}
    Total: ${orderData.tot}
    Items in Cart:
    ${itemsList}`;

    const sellerPhoneNumber = "+2348104421182";
    const whatsappUrl = `https://wa.me/${sellerPhoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, "_blank");

    // Clear the form
    setName("");
    setLastName("");
    setTel("");
    setEmail("");
    setAddress("");
    setZipCode("");
    setSelectedCity("");
    setSelectedCountry("");
    setDeliveryMethod("");
    setPaymentMethod("credit-card");
    clearCart();
    window.location.href = "/";

    // Show success pop-up
    alert("Order placed successfully! We'll process your order shortly.");
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   const orderData = {
  //     name,
  //     lastName,
  //     tel,
  //     email,
  //     address,
  //     zipCode,
  //     paymentMethod,
  //     deliveryMethod,
  //     itemsInCart,
  //   };

  //   try {
  //     const response = await fetch("http://localhost:3000/send-order", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(orderData),
  //     });

  //     if (response.ok) {
  //       alert("Order email sent successfully!");
  //     } else {
  //       alert("Failed to send order email.");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("An error occurred while sending the email.");
  //   }
  // };

  return (
    <div className="min-h-screen bg-white">
      <Navbar /> {/* Render the Navbar component */}
      <div className="max-w-7xl mx-auto py-10 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-gray-50 p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
          <div className="mb-6">
            <div className="flex  overflow-x-auto scroll-smooth scrollbar-hide gap-2 snap-x snap-mandatory">
              {cart.length === 0 ? (
                <p className="text-xs text-gray-400">No products in cart.</p>
              ) : (
                cart.map((product, index) => (
                  <div
                    key={product.title + index}
                    className="flex py-4 gap-2 shadow-sm"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="text-sm w-20 truncate overflow-hidden font-medium text-gray-900">
                      <div className="items-start flex flex-col">
                        <a
                          className="text-ellipsis"
                          href={`/product/${product.id}`}
                        >
                          {product.title}
                        </a>
                        <p className="text-gray-500">x{product.qty}</p>
                        <XMarkIcon
                          className="h-4 w-4"
                          onClick={() => removeItem(product.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <span className="text-xs flex justify-end md:text-sm text-blue-500">
              scroll to see more
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  placeholder="Type here"
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  placeholder="Type here"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={tel}
                  placeholder="Type here"
                  onChange={(e) => setTel(e.target.value)}
                  required
                  className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  placeholder="Type here"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Street Address, City, Zip Code (e.g., 123 Main St, New York, 10001)"
                  className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="400211"
                  className="mt-1 block w-1/2 p-3 rounded-sm shadow-sm focus:ring-black focus:border-black"
                  value={zipCode}
                  required
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 block w-full p-3 rounded-sm shadow-sm focus:ring-black focus:border-black"
                  value={selectedCountry}
                  required
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 block w-full p-3 rounded-sm shadow-sm focus:ring-black focus:border-black"
                  value={selectedCity}
                  required
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {selectedCountry &&
                    countries
                      .find((c) => c.name === selectedCountry)
                      ?.cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Delivery Method <span className="text-red-500">*</span>
              </label>
              <select
                className="mt-1 block p-3 w-1/2 rounded-sm shadow-sm focus:ring-black focus:border-black"
                value={deliveryMethod}
                required
                onChange={(e) => setDeliveryMethod(e.target.value)}
              >
                <option value="">select method</option>
                <option value="standard">Standard (3-5 days)</option>
                <option value="Expedited">Expedited (1-2 days)</option>
                <option value="pickup">Local Pickup (Today)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Message to seller
                </label>
                <textarea
                  className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                  rows="2"
                  placeholder="Your Feedback"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg focus:outline-none hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-sm focus:outline-none hover:bg-gray-800"
              >
                Continue
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-8 shadow-lg rounded-lg lg:h-1/2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Coupons</span>
              <span className="font-medium">
                {coupon > 0 ? (
                  coupon
                ) : (
                  <span className="text-xs text-gray-100">
                    no coupons available
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping </span>
              <span className="font-medium">{formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-medium">
                {formatCurrency(subt + shipping - coupon)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Payment Method
            </h2>
            <div className="gap-2 flex items-start flex-col w-full">
              <div className="">
                <input
                  id="tnx"
                  name="payment-method"
                  type="radio"
                  value="Bank transfer"
                  checked={paymentMethod === "transfer"}
                  onChange={handlePaymentMethodChange}
                  className="hidden"
                />
                <label
                  htmlFor="paypal"
                  className="flex items-center justify-center w-full p-2 rounded-sm cursor-pointer hover:bg-gray-100 "
                >
                  <Bank className="w-4 h-4 text-gray-500" />
                  <span className="ml-4 text-gray-900">Bank Transfer</span>
                </label>
              </div>
              <div className="">
                <input
                  id="credit-card"
                  name="payment-method"
                  type="radio"
                  // value="credit-card"
                  // checked={paymentMethod === "credit-card"}
                  // onChange={handlePaymentMethodChange}
                  className="hidden"
                />
                <label
                  htmlFor="credit-card"
                  className="flex items-center justify-center w-full p-2 rounded-lg cursor-pointer bg-gray-0"
                >
                  <CreditCard className="w-4 h-4 text-gray-100" />
                  <span className="ml-4 text-gray-100">Credit Card</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Render the Footer component */}
    </div>
  );
};

export default CheckoutPage;
