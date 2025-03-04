import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Bank, CreditCard } from "react-bootstrap-icons";
import { useCart } from "../../context/cart/context";
import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // import your firebase config
import { formatCurrency } from "../../utils/format";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/user/context";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QyK8V4c8WUQECbxYXyZzSp0P4on8rgu9wMroRlbt6kNkQTxPrjQJa10xdjU2XOgFEEhw81xqR8PItoFIq0OHWrD00BUqoV2uc"
); // Replace with your Stripe public key

const CheckoutPage = () => {
  const countries = [
    { name: "United States", cities: ["New York", "Los Angeles", "Chicago"] },
    { name: "Canada", cities: ["Toronto", "Montreal", "Vancouver"] },
    { name: "United Kingdom", cities: ["London", "Manchester", "Birmingham"] },
    { name: "Nigeria", cities: ["Abuja", "Lagos", "Port-Harcourt"] },
  ];

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const { removeItem, clearCart, cartItems = [] } = useCart();
  const { userData } = useUser();
  const navigate = useNavigate();

  const cart = cartItems.reduce(
    (acc, item) => {
      const existingItem = acc.cart.find((cartItem) => cartItem.id === item.id);
      if (!existingItem) {
        acc.cart.push({ ...item, qty: item.quantity });
      } else {
        existingItem.qty += item.quantity;
      }
      return acc;
    },
    { cart: [] }
  ).cart;

  const subt = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = 0;

  let tot = subt + shipping - discount; // In USD (need to convert to Naira)

  // Handle coupon validation (Fetch coupon from Firestore)
  const validateCoupon = async (couponCode) => {
    try {
      const couponQuerySnapshot = await getDocs(collection(db, "coupons"));
      const coupons = couponQuerySnapshot.docs.map((doc) => doc.data());
      const couponData = coupons.find(
        (c) => c.code.toLowerCase() === couponCode.toLowerCase()
      );

      if (!couponData) {
        alert("Invalid coupon code.");
        return;
      }

      const currentDate = new Date();
      const { discount, startDate, endDate } = couponData;
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (currentDate < start || currentDate > end) {
        alert("Coupon has expired or is not valid yet.");
        return;
      }

      setDiscount(discount); 
      alert(`Coupon applied! Discount: ${discount}%`);
    } catch (error) {
      console.error("Error fetching coupon:", error);
      alert("There was an error fetching the coupon.");
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const data = await response.json();
      return data.rates?.NGN ?? "000";
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
      return 800; // Fallback rate
    }
  };

  const convertToNaira = async (usdAmount) => {
    const exchangeRate = await fetchExchangeRate();
    return usdAmount * exchangeRate;
  };

  async function applyCoupon(code) {
    const response = await fetch("/api/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    if (data.success) {
      console.log(`Discount applied: ${data.discount}%`);
    } else {
      console.error(data.error);
    }
  }
  async function processPayment(amount, paymentMethodId) {
    if (typeof paymentMethodId !== "string") {
      console.error("Invalid paymentMethodId:", paymentMethodId);
      return;
    }

    const response = await fetch("/api/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: "usd", // Change to "ngn" if converted
        paymentMethodId,
      }),
    });

    const data = await response.json();
    console.log("Payment Response:", data);
  }

  // Handle the order submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    const orderData = {
      userId: userData.uid,
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
      createdAt: new Date().toISOString(),
    };

    // Send order data to Firestore
    try {
      // await setDoc(doc(collection(db, "orders")), orderData);
      await addDoc(collection(db, "orders"), orderData);
      alert("Order placed successfully!");
      setName("");
      setLastName("");
      setTel("");
      setEmail("");
      setAddress("");
      setZipCode("");
      setSelectedCity("");
      setSelectedCountry("");
      setDeliveryMethod("");
      setSelectedCountry("");
      setSelectedCity("");
      setPaymentMethod("credit-card");
      clearCart();
      navigate(`/${userData?.uid}/orders`);
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("There was an error placing your order.");
    }
  };
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
                cart.map((product) => (
                  <div key={product.id} className="flex py-4 gap-2 shadow-sm">
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
            <div className="text-red-500 text-sm">
              {name === "" ? "* indicates required field" : ""}
            </div>
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
            <div className="flex items-center w-full">
              <span className="font-thin w-full">
                <div className="flex justify-between w-full">
                  <input
                    type="text"
                    placeholder="enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="border-gray-400 rounded-sm focus:outline-primary/30 p-2 flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => applyCoupon(coupon)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-sm"
                  >
                    +
                  </button>
                </div>
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
              <div>
                <input
                  id="transfer"
                  name="payment-method"
                  type="radio"
                  value="Bank transfer"
                  checked={paymentMethod === "Bank transfer"}
                  onChange={(e) => processPayment(tot, e.target.id)}
                  className="hidden"
                />
                <label
                  htmlFor="transfer"
                  className="flex items-center justify-center w-full p-2 rounded-sm cursor-pointer hover:bg-gray-100 "
                >
                  <Bank className="w-4 h-4 text-gray-500" />
                  <span className="ml-4 text-gray-900">Bank Transfer</span>
                </label>
              </div>
              <div>
                <input
                  id="credit-card"
                  name="payment-method"
                  type="radio"
                  value="Credit Card"
                  checked={paymentMethod === "Credit Card"}
                  onChange={(e) => processPayment(tot, e.target.id)}
                  className="hidden"
                />
                <label
                  htmlFor="credit-card"
                  className="flex items-center justify-center w-full p-2 rounded-sm cursor-pointer hover:bg-gray-100"
                >
                  <CreditCard className="w-4 h-4 text-gray-900" />
                  <span className="ml-4 text-gray-900">Credit Card</span>
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
