import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const PaymentComponent = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe has not loaded yet.");
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      alert(`Payment error: ${error.message}`);
      return;
    }

    setLoading(true);

    const paymentData = {
      amount: totalAmount * 100, // Convert to smallest currency unit (kobo)
      currency: "NGN",
      paymentMethodId: paymentMethod.id,
    };

    try {
      const response = await fetch("/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      setLoading(false);

      if (result.error) {
        alert(`Payment failed: ${result.error}`);
      } else {
        alert("Payment successful!");
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default PaymentComponent;
