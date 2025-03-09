import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/context";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Assuming you already initialized Firebase
import { formatCurrency } from "../../utils/format";

// Function to format the date to "Month Day, Year" format (e.g. Jul 6, 2021)
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};

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
        navigate(`/orders/${orderId}`);
    };    const handleViewProducts = (pid) => {
        navigate(`/product/${pid}`);
    };

    return (
        <main aria-labelledby="order-history-heading" className="pt-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <h1 id="order-history-heading" className="text-3xl font-semibold text-gray-900">
                    Order History
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Check the status of recent orders, manage returns, and discover similar products.
                </p>

                {/* Order list */}
                <div className="mt-10 space-y-12">
                    {orders?.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                                <div className="px-6 py-4">
                                    {/* Order Header */}
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order placed on <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Order number: {order.itemsInCart.length} | Total amount: {formatCurrency(order.tot)}
                                    </p>
                                </div>

                                {/* Items in Order */}
                                <div className="px-6 py-4">
                                    <h4 className="font-medium text-gray-800">Items</h4>
                                    <ul className="space-y-4">
                                        {order.itemsInCart?.map((item, index) => (
                                            <li key={index} className="flex items-start space-x-4">
                                                <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover" />
                                                <div className="flex-1">
                                                    <h5 className="text-sm font-medium text-gray-800">{item.name}</h5>
                                                    <p className="text-sm text-gray-500">{item.shortDescription}</p>
                                                    <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewProducts(item.id)}
                                                        className="text-blue-600 hover:text-blue-900 text-xs"
                                                    >
                                                        View Product
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelOrder(order.id, order.status)}
                                                        className={`text-sm ${order.status === "Shipped" ? "text-gray-500" : "text-red-600"} hover:text-red-900`}
                                                        disabled={order.status === "Shipped"}
                                                    >
                                                        {order.status === "Shipped" ? "Shipped" : "Cancel Order"}
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Order Status & Actions */}
                                <div className="px-6 py-4 border-t border-gray-200">
                                    {order.status === "Shipped" ? (
                                        <p className="text-sm text-gray-600">
                                            Delivered on <time dateTime={order.deliveryDate}>{formatDate(order.deliveryDate)}</time>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-600">Status: {order.status}</p>
                                    )}
                                    <div className="mt-4 flex space-x-4">
                                        <button
                                            onClick={() => handleViewDetails(order.id)}
                                            className="text-sm text-blue-600 hover:text-blue-900"
                                        >
                                            View Order
                                        </button>
                                        <button
                                            onClick={() => navigate(`/invoice/${order.id}`)}
                                            className="text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            View Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No orders found</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default OrdersPage;
