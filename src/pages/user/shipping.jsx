import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrders } from "../../context/orders/context";
import { db } from "../../firebase/firebase"; // Assuming Firebase is set up
import { doc, getDoc } from "firebase/firestore";
import { Load } from "../../components/common/loading";
import { formatCurrency } from "../../utils/format";

const ShippingPage = () => {
    const { orderId } = useParams();
    const { orders } = useOrders();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const order = orders?.find((order)=>( orders.id === orderId));
                if (!order) {
                    setError("Order not found");
                    return;
                }
                console.log(order)
                setOrderDetails(order);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Error fetching order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, orders]);

    if (loading) {
        return <Load />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="p-4 bg-white shadow-md rounded-sm w-full sm:w-11/12 lg:w-96 mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>

            {/* Shipping Information */}
            <div className="mb-4">
                <p><strong>Order ID:</strong> {orderDetails?.id}</p>
                <p><strong>Status:</strong> {orderDetails?.status}</p>
                <p><strong>Shipping Address:</strong> {orderDetails?.address}</p>
                <p><strong>Total:</strong> {formatCurrency(orderDetails)?.tot}</p>
            </div>

            {/* Progress Bar for Shipping */}
            <div className="w-full mb-4">
                <p><strong>Shipping Progress</strong></p>
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span
                                className={`text-xs inline-block py-1 px-2 rounded-full ${orderDetails?.status === "Shipped" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                            >
                                proccessed
                            </span>
                        </div>
                        <div>
                            <span
                                className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${orderDetails?.status === "Out for Delivery" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                            >
                                shipped
                            </span>
                        </div>
                        <div>
                            <span
                                className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${orderDetails?.status === "Delivered" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                            >
                                delivered
                            </span>
                        </div>
                    </div>
                    <div className="flex mb-2 justify-between text-xs font-semibold">
                        <div className={`${orderDetails?.status === "Shipped" ? "text-blue-600" : "text-gray-300"}`}>
                            Shipped
                        </div>
                        <div className={`${orderDetails?.status === "Out for Delivery" ? "text-blue-600" : "text-gray-300"}`}>
                            Out for Delivery
                        </div>
                        <div className={`${orderDetails?.status === "Delivered" ? "text-blue-600" : "text-gray-300"}`}>
                            Delivered
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Tracking Information */}
            <div className="mb-4">
                <p><strong>Tracking Number:</strong> {orderDetails?.trackingNumber || "N/A"}</p>
                {orderDetails?.status === "Out for Delivery" && (
                    <p className="text-green-600 font-semibold">Your order is out for delivery.</p>
                )}
            </div>
        </div>
    );
};

export default ShippingPage;
