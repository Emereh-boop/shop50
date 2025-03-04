import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Import your firebase configuration
import { Load } from "../../components/common/loading";
import Toast from "../../components/common/toast";
import { useAuth } from "../../context/auth/context";
import { useOrders } from "../../context/orders/context";
import { formatCurrency } from "../../utils/format"; // Assuming you have a format function for currency

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { orders, setOrders } = useOrders(); // Use orders context to access and update orders
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderDocRef = doc(db, "orders", orderId);
                const docSnap = await getDoc(orderDocRef);

                if (docSnap.exists()) {
                    setOrderDetails(docSnap.data());
                } else {
                    setError("Order not found.");
                }
            } catch (err) {
                setError("Error fetching order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleCancelOrder = async () => {
        if (orderDetails?.status === "shipped") {
            setError("Cannot cancel a shipped order.");
            return;
        }

        // Update the order status to 'cancelled' and add the cancellation reason
        setIsCancelling(true);
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: "cancelled",
                cancellationReason: cancellationReason,
            });

            // Update the local context or state to reflect the changes
            setOrders(prevOrders => 
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: "cancelled", cancellationReason } : order
                )
            );

            setError("Order has been cancelled successfully.");
        } catch (err) {
            setError("Error cancelling the order.");
        } finally {
            setIsCancelling(false);
            setShowModal(false);
        }
    };

    const handleGoBack = () => {
        navigate(`/${user?.uid}/orders`);
    };

    if (loading) return <Load />;
    if (error) return <Toast type="error" message={error} />;

    return (
        <div className="p-6 bg-white shadow-md rounded-sm">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>

            {/* Order Status */}
            <p><strong>Status:</strong> {orderDetails?.status}</p>

            {/* Product Images - Scrollable on mobile */}
            <div className="flex overflow-x-auto space-x-4 py-4">
                {orderDetails?.itemsInCart?.map((item, index) => (
                    <div key={index} className="flex-shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover" />
                    </div>
                ))}
            </div>

            {/* Cancel Order Button */}
            {orderDetails?.status !== "shipped" && (
                <button
                    className="bg-red-600 text-white p-2 rounded-sm mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Cancel Order
                </button>
            )}
            {orderDetails?.status === "shipped" && (
                <p className="text-red-500 mt-4">Cannot cancel a shipped order.</p>
            )}

            {/* Modal for Cancellation */}
            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded-sm w-96">
                        <h3 className="text-xl font-semibold mb-4">Cancel Order</h3>
                        <p>Please provide a reason for cancellation:</p>
                        <textarea
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-sm mt-2"
                            rows="4"
                        />
                        <div className="mt-4 flex space-x-4">
                            <button
                                className="bg-gray-600 text-white p-2 rounded-sm"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-red-600 text-white p-2 rounded-sm"
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                            >
                                {isCancelling ? "Cancelling..." : "Confirm Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Go Back Button */}
            <div className="mt-4">
                <button
                    className="bg-gray-600 text-white p-2 rounded-sm"
                    onClick={handleGoBack}
                >
                    Back to Orders
                </button>
            </div>
        </div>
    );
};

export default OrderDetailPage;
