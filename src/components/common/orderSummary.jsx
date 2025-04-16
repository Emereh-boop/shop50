import React from "react";
import { formatCurrency } from "../../utils/format";
import { validateCoupon } from "../../utils/validate-coupon";
import paystack from "../../images/paystack.png";

const OrderSummary = ({
    subtotal,
    shipping,
    total,
    email,
    paymentMethod,
    processPayment,
    selectedCountry,
    selectedCity,
    coupon,
    setCoupon,
    discount,
    setDiscount,
    paymentStatus, // Added paymentStatus to show payment status
}) => {
    const handleCouponApply = async (couponCode) => {
        // Validate coupon on button click
        const result = await validateCoupon(couponCode);
        if (result.valid) {
            setDiscount(result.discount); // Set the discount from the coupon
            console.log("coupon discount", discount);
        } else {
            // Handle invalid coupon error if needed
            console.log(result.message);
        }
    };

    return (
        <div className="bg-gray- 50 p-8 shadow-sm rounded-sm lg:h-1/2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center w-full">
                    <span className="w-full">
                        <div className="flex justify-between w-full">
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                className="border-gray-400 rounded-sm focus:outline-primary/30 p-2 flex-grow"
                            />
                            <button
                                type="button"
                                onClick={() => handleCouponApply(coupon)}
                                className="bg-gray-800 text-white px-3 py-2 rounded-sm"
                            >
                                Apply
                            </button>
                        </div>
                    </span>
                </div>
                <p className="mt-4 text-sm">
                    {shipping
                        ? `Shipping cost for ${selectedCity}, ${selectedCountry} is ${formatCurrency(shipping)}`
                        : "Select a country and city to see shipping cost."}
                </p>
                <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
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
                            id="paystack"
                            name="payment-method"
                            type="radio"
                            value="Paystack"
                            checked={paymentMethod === "Paystack"}
                            onChange={() => processPayment(total, email)}
                            className="hidden"
                            disabled={paymentStatus === "Paid" || paymentStatus === "Failed"} // Disable if Paid or Failed
                        />
                        <label
                            htmlFor="paystack"
                            className={`flex items-center justify-start w-full p-2 rounded-sm cursor-pointer hover:bg-gray-100 ${paymentStatus === "Paid" && "bg-green-100"}`}
                        >
                            <img loading="lazy" src={paystack} alt="paystack" className="w-1/2" />
                        </label>
                    </div>
                </div>
            </div>

            {/* Payment Status Section */}
            <div className="mt-4">
                {paymentStatus === "Paid" && (
                    <div className="text-green-600">Payment Successful</div>
                )}
                {paymentStatus === "Pending" && (
                    <div className="text-yellow-600">Payment Pending</div>
                )}
                {paymentStatus === "Failed" && (
                    <div className="text-red-600">Payment Failed</div>
                )}
            </div>
        </div>
    );
};

export default OrderSummary;
