import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/context";
import { useUser } from "../../context/user/context";
import { Facebook, Instagram, Tiktok, Heart, CreditCard } from "react-bootstrap-icons";
import { Load } from "../../components/skeletons/loading";
import LoginModal from "../auth/Login";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { DeliveryDining } from "@mui/icons-material";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { userData, loading } = useUser();
    const [addresses, setAddresses] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("orders"); // Start with orders section open

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            if (loading) return;
            if (!user) {
                setLoginModalOpen(true);
            }

            try {
                setLoadingOrders(true);

                // Fetch addresses
                const addressesRef = collection(db, "addresses");
                const addressesQuery = query(addressesRef, where("userId", "==", user?.uid));
                const addressesSnapshot = await getDocs(addressesQuery);
                const fetchedAddresses = [];
                addressesSnapshot.forEach((doc) => {
                    fetchedAddresses.push({ id: doc.id, ...doc.data() });
                });
                setAddresses(fetchedAddresses);

                // Fetch wishlist items
                const wishlistRef = collection(db, "wishlist");
                const wishlistQuery = query(wishlistRef, where("userId", "==", user?.uid));
                const wishlistSnapshot = await getDocs(wishlistQuery);
                const fetchedWishlist = [];
                wishlistSnapshot.forEach((doc) => {
                    fetchedWishlist.push({ id: doc.id, ...doc.data() });
                });
                setWishlist(fetchedWishlist);

                // Fetch payment methods
                const paymentMethodsRef = collection(db, "paymentMethods");
                const paymentMethodsQuery = query(paymentMethodsRef, where("userId", "==", user?.uid));
                const paymentMethodsSnapshot = await getDocs(paymentMethodsQuery);
                const fetchedPaymentMethods = [];
                paymentMethodsSnapshot.forEach((doc) => {
                    fetchedPaymentMethods.push({ id: doc.id, ...doc.data() });
                });
                setPaymentMethods(fetchedPaymentMethods);
            } catch (error) {
                console.log("Error fetching data:", error);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchData();
    }, [user, navigate, loading]);

    if (loading || loadingOrders) return <Load />;

    // Handle section toggle
    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section); // Close the section if already open
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirect to login page after logging out
    };

    return (
        <div className="flex pt-16 min-h-svh bg-secondary">
            {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} setIsOpen={setLoginModalOpen} onClose={() => setLoginModalOpen(false)} />}

            {/* Main Content */}
            <div className="flex-1 flex-col justify-between flex p-6 lg:mx-16 bg-secondary">
                <div className="space-y-4">
                    {/* Greeting with User Name and Email */}
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-700">
                            Hello, {userData?.displayName ? userData.displayName : "User"}!
                        </h1>
                        <p className="text-sm text-gray-500">
                            {user?.email ? user.email.replace(/(^.{3})(.*)(?=@)/, '$1***') : ''}
                        </p>
                    </div>

                    {/* Dropdown Sections */}
                    <div className="space-y-2 bg-white p-4 rounded-sm shadow-sm">
                        {/* Orders Section */}
                        <div className="bg-white px-4 ">
                            <button
                                onClick={() => toggleSection("orders")}
                                className="w-full flex items-center justify-between text-gray-700 px-4"
                            >
                                <div className="flex items-center space-x-3">
                                    <DeliveryDining className="text-xl" />
                                    <span className="font-medium">Orders</span>
                                </div>
                                <span>{activeSection === "orders" ? "-" : "+"}</span>
                            </button>
                            {activeSection === "orders" && (
                                <div className="bg-white px-4">
                                    <p>
                                        <a href={`/${userData?.uid}/orders`} className="text-blue-500 underline">
                                            View your orders
                                        </a>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Disabled Sections (Addresses, Wishlist, Payment Methods) */}
                        <div className="bg-white p-4 opacity-50 cursor-not-allowed">
                            <button
                                disabled
                                className="w-full flex items-center justify-between text-gray-700 p-4"
                            >
                                <div className="flex items-center space-x-3">
                                    <DeliveryDining className="text-xl" />
                                    <span className="font-medium">Shipping Addresses</span>
                                </div>
                            </button>
                        </div>

                        <div className="bg-white p-4 opacity-50 cursor-not-allowed">
                            <button
                                disabled
                                className="w-full flex items-center justify-between text-gray-700 p-4"
                            >
                                <div className="flex items-center space-x-3">
                                    <Heart className="text-xl" />
                                    <span className="font-medium">Wishlist</span>
                                </div>
                            </button>
                        </div>

                        <div className="bg-white p-4 opacity-50 cursor-not-allowed">
                            <button
                                disabled
                                className="w-full flex items-center justify-between text-gray-700 p-4"
                            >
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="text-xl" />
                                    <span className="font-medium">Payment Methods</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Media Share */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">Share YNT</h3>
                    <div className="flex space-x-4">
                        <button className="p-2 text-gray-700 hover:bg-gray-200 rounded-full">
                            <Facebook className="text-xl" />
                        </button>
                        <button className="p-2 text-gray-700 hover:bg-gray-200 rounded-full">
                            <Instagram className="text-xl" />
                        </button>
                        <button className="p-2 text-gray-700 hover:bg-gray-200 rounded-full">
                            <Tiktok className="text-xl" />
                        </button>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="mt-6 p-3 text-red-500 hover:bg-gray-200 rounded-sm flex items-center justify-center"
                    >
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
