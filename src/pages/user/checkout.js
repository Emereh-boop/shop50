import React, { useState } from "react";
import { useCart } from "../../context/cart/context";
import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import { useUser } from "../../context/user/context";
import OrderSummary from "../../components/common/orderSummary";
import CheckoutForm from "../../components/common/CheckoutForm";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { handlePaystackPayment } from "../../utils/handle-paystack";
import Toast from "../../components/common/toast";

const CheckoutPage = () => {
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
  const [paid, setPaid] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Pending"); // Added payment status

  const { removeItem, clearCart, cartItems = [] } = useCart();
  const { userData } = useUser(); // Get user data from context

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
  const shipping = 1000;
  const tot = (subt + shipping) - ((discount / 100) * (subt + shipping));

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    try {
      // Send order data to Firestore
      await addDoc(collection(db, "orders"), orderData);
      <Toast type="success" message="Order placed successfully!" />;
      clearCart();
      // Reset form
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
      setCoupon('')
      setDiscount(0)
      setPaid(false)
      window.location.href = `/${userData?.uid}/orders`
    } catch (error) {
      <Toast type="error" message="Error placing order" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-gray-50 p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

          <CheckoutForm
            cart={cart}
            remove={removeItem}
            handleSubmit={handleSubmit}
            setName={setName}
            setEmail={setEmail}
            setAddress={setAddress}
            name={userData?.name || name}
            tel={tel}
            setTel={setTel}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            address={address}
            zipCode={zipCode}
            setZipCode={setZipCode}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            paid={paid}
          />
        </div>
        {/* Order Summary */}
        <OrderSummary
          subtotal={subt}
          shipping={shipping}
          total={tot}
          email={email}
          handleCouponChange={setCoupon}
          paymentMethod={paymentMethod}
          processPayment={() => handlePaystackPayment(tot, email, setPaid, setPaymentStatus)}
          coupon={coupon}
          setCoupon={setCoupon}
          discount={discount}
          setDiscount={setDiscount}
          paymentStatus={paymentStatus} // Pass paymentStatus to OrderSummary
        />
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
