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
    const { user } = useAuth();

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
        return <Toast type="error" message={error} />;
    }

    const formattedDate = new Date(orderDetails.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // Order Status Stages
    const statusStages = ['Order placed', 'Processing', 'Shipped', 'Delivered'];
    const currentStatusIndex = statusStages.indexOf(orderDetails?.status);
    const progressWidth = (currentStatusIndex / (statusStages.length - 1)) * 100;

    return (
        <main className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-sm shadow-md">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Order #{orderId}</h1>

                <div className="flex justify-between mb-6">
                    <p className="text-sm text-gray-600">Order placed <time dateTime={orderDetails.createdAt} className="font-medium">{formattedDate}</time></p>
                    <a href={`/${orderId}/invoice`} className="text-sm text-blue-600 hover:underline">View invoice →</a>
                </div>

                {/* Products Purchased */}
                <section aria-labelledby="products-heading">
                    <h2 id="products-heading" className="text-lg font-semibold text-gray-900 mb-4">Products Purchased</h2>

                    <div className="space-y-4">
                        {orderDetails?.itemsInCart?.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-sm" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Shipping & Status */}
                <section className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Status</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium text-gray-700">Shipping Address</p>
                            <p className="text-sm text-gray-500">{orderDetails?.address}, {orderDetails?.selectedCity}, {orderDetails?.selectedCountry}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Contact Information</p>
                            <p className="text-sm text-gray-500">{orderDetails?.email}</p>
                            <p className="text-sm text-gray-500">{orderDetails?.tel}</p>
                        </div>
                    </div>

                    {/* Order Status and Progress */}
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Status</h4>
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                {statusStages.map((stage, index) => (
                                    <div key={stage} className={`text-xs font-medium inline-block py-1 px-2
                                        ${index <= currentStatusIndex ? 'text-green-600' : 'text-gray-400 '}`}>
                                        {stage}
                                    </div>
                                ))}
                            </div>

                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full">
                                        <div className="h-2 bg-gray-800 rounded-full" style={{ width: `${progressWidth}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Billing Summary */}
                <section className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
                    <dl className="space-y-2">
                        <div className="flex justify-between">
                            <dt className="text-sm text-gray-700">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">{formatCurrency(orderDetails?.subt)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-gray-700">Shipping</dt>
                            <dd className="text-sm font-medium text-gray-900">{formatCurrency(orderDetails?.shipping)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-gray-700">Tax</dt>
                            <dd className="text-sm font-medium text-gray-900">{formatCurrency(orderDetails?.tax)}</dd>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <dt className="text-sm text-gray-700">Order Total</dt>
                            <dd className="text-sm text-gray-900">{formatCurrency(orderDetails?.tot)}</dd>
                        </div>
                    </dl>
                </section>

                {/* Action Button */}
                <div className="mt-6 text-right">
                    <button
                        className="px-4 py-2 bg-gray-600 text-white rounded-sm hover:bg-gray-700"
                        onClick={handleGoBack}
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        </main>
    );
};

export default OrderDetailPage;
