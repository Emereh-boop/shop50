import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/context";
import { useOrders } from "../../context/orders/context";
import { Load } from "../../components/common/loading";
import { formatCurrency } from "../../utils/format";

const OrdersPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from auth context
    const { orders } = useOrders(); // Use orders context

    const handleTrackOrder = (orderId) => {
        navigate(`/shipping/${orderId}`); // Navigate to the shipping page for the specific order
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-sm">
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

            {/* Check if there are orders */}
            {orders?.length > 0 ? (
                <>
                    {/* Large Screen Table */}
                    <div className="hidden lg:block">
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border-b text-left">Order ID</th>
                                    <th className="p-2 border-b text-left">Status</th>
                                    <th className="p-2 border-b text-left">Total</th>
                                    <th className="p-2 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 4).map((order) => (
                                    <tr key={order?.id} className="border-b">
                                        <td className="p-2">{order?.id}</td>
                                        <td className="p-2">{order?.status}</td>
                                        <td className="p-2">{formatCurrency(order?.tot)}</td>
                                        <td className="p-2">
                                            <button
                                                className="bg-blue-600 text-white p-2 rounded-sm"
                                                onClick={() => handleTrackOrder(order?.id)}
                                            >
                                                Track Order
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Small Screen List */}
                    <div className="lg:hidden">
                        {orders.slice(0, 4).map((order) => (
                            <div key={order?.id} className="border-b p-4">
                                <p><strong>Order ID:</strong> {order?.id}</p>
                                <p><strong>Status:</strong> {order?.status}</p>
                                <p><strong>Total:</strong> {formatCurrency(order?.tot)}</p>
                                <div className="mt-2">
                                    <button
                                        className="bg-blue-600 text-white p-2 rounded-sm"
                                        onClick={() => handleTrackOrder(order?.id)}
                                    >
                                        Track Order
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>No orders found</p>
            )}
        </div>
    );
};

export default OrdersPage;
