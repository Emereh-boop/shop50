// OrderDetailPage.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase"; // Import your firebase configuration
import { doc, getDoc } from "firebase/firestore"; // Firestore functions to fetch a document
import { formatCurrency } from "../../utils/format"; // Assuming you have a format function for currency
import { Load } from "../../components/common/loading";
import Toast from "../../components/common/toast";
import { useAuth } from "../../context/auth/context";

const OrderDetailPage = () => {
    const { orderId } = useParams(); // Extract orderId from the URL params
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth()

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Get a reference to the order document in Firestore
                const orderDocRef = doc(db, "orders", orderId);
                const docSnap = await getDoc(orderDocRef);

                if (docSnap.exists()) {
                    // If the document exists, set the order details
                    setOrderDetails(docSnap.data());
                } else {
                    // If the document doesn't exist
                    setError("Order not found.");
                }
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("There was an error fetching the order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleGoBack = () => {
        navigate(`/${user?.uid}/orders`); // Navigate back to the orders page
    };

    if (loading) {
        return <Load />;
    }

    if (error) {
        return <Toast type='error' message={error}/>;
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-sm">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>

            {/* Order Details */}
            <div className="space-y-4">
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Created At:</strong> {new Date(orderDetails?.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {orderDetails?.status}</p>
                <p><strong>Delivery Method:</strong> {orderDetails?.deliveryMethod}</p>
                <p><strong>Address:</strong> {orderDetails?.address}</p>
                <p><strong>City:</strong> {orderDetails?.selectedCity}</p>
                <p><strong>Country:</strong> {orderDetails?.selectedCountry}</p>
                <p><strong>Email:</strong> {orderDetails?.email}</p>
                <p><strong>Payment Method:</strong> {orderDetails?.paymentMethod}</p>
                <p><strong>Total:</strong> {formatCurrency(orderDetails?.tot)}</p>

                {/* Display Items in Cart */}
                <h3 className="font-semibold mt-4">Items in Cart:</h3>
                <ul className="space-y-2">
                    {orderDetails?.itemsInCart?.map((item, index) => (
                        <li key={index} className="border p-2 rounded-sm">
                            <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover" />
                            <p><strong>Title:</strong> {item.title}</p>
                            <p><strong>Brand:</strong> {item.brand}</p>
                            <p><strong>Category:</strong> {item.category}</p>
                            <p><strong>Price:</strong> {formatCurrency(item.price)}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Description:</strong> {item.longDescription}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action buttons */}
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
