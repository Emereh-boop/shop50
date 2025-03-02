import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/context";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // assuming you already initialized Firebase
import { Load } from "../../components/common/loading";
import { formatCurrency } from "../../utils/format";

const OrdersPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from auth context
    const [orders, setOrders] = useState([]); // Store orders

    useEffect(() => {
        const fetchOrders = async () => {
            if (loading) return; // Don't proceed until loading is done

            try {
                const ordersRef = collection(db, "orders");
                const q = query(ordersRef, where("userId", "==", user?.uid));
                const querySnapshot = await getDocs(q);
                const fetchedOrders = [];
                querySnapshot.forEach((doc) => {
                    fetchedOrders.push({ id: doc.id, ...doc.data() });
                });
                setOrders(fetchedOrders); // Update state with fetched orders
            } catch (error) {
                console.error("Error fetching orders: ", error);
            }
        };

        fetchOrders();
    }, [user, navigate, loading]);

    // Function to handle cancel action
    const handleCancelOrder = async (orderId, status) => {
        if (status === "Shipped") {
            alert("This order has already been shipped and cannot be canceled.");
            return;
        }

        setLoading(true);

        try {
            const orderDocRef = doc(db, "orders", orderId);
            await deleteDoc(orderDocRef); // Delete the order from Firestore
            setOrders(orders.filter(order => order.id !== orderId)); // Update local state to remove the canceled order
            alert("Order has been canceled successfully.");
        } catch (error) {
            console.error("Error canceling order: ", error);
            alert("There was an issue canceling your order. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Function to handle view order details
    const handleViewDetails = (orderId) => {
        // Navigate to a separate order details page (for example, `/orders/${orderId}`)
        navigate(`/orders/${orderId}`);
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
                                    <th className="p-2 border-b text-left">Address</th>
                                    <th className="p-2 border-b text-left">Total</th>
                                    <th className="p-2 border-b text-left">Payment Method</th>
                                    <th className="p-2 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 4).map((order) => (
                                    <tr key={order?.id} className="border-b">
                                        <td className="p-2">{order?.id}</td>
                                        <td className="p-2">{order?.status}</td>
                                        <td className="p-2">{order?.address}</td>
                                        <td className="p-2">{formatCurrency(order?.tot)}</td>
                                        <td className="p-2">{order?.paymentMethod}</td>
                                        <td className="p-2">
                                            <button
                                                className="bg-red-600 text-white p-2 rounded-sm mr-2"
                                                onClick={() => handleCancelOrder(order?.id, order?.status)}
                                                disabled={loading}
                                            >
                                                {loading ? "Canceling..." : "Cancel Order"}
                                            </button>
                                            <button
                                                className="bg-blue-600 text-white p-2 rounded-sm"
                                                onClick={() => handleViewDetails(order?.id)}
                                            >
                                                View Details
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
                                <p><strong>Address:</strong> {order?.address}</p>
                                <p><strong>Total:</strong> {formatCurrency(order?.tot)}</p>
                                <p><strong>Payment Method:</strong> {order?.paymentMethod}</p>
                                <div className="mt-2">
                                    <button
                                        className="bg-red-600 text-white p-2 rounded-sm mr-2"
                                        onClick={() => handleCancelOrder(order?.id, order?.status)}
                                        disabled={loading}
                                    >
                                        {loading ? "Canceling..." : "Cancel Order"}
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white p-2 rounded-sm"
                                        onClick={() => handleViewDetails(order?.id)}
                                    >
                                        View Details
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
