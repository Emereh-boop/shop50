import React, { createContext, useContext, useEffect, useState } from "react";
import {
    getFirestore, collection, query, where, getDocs, limit, startAfter, onSnapshot
} from "firebase/firestore";
import { useAuth } from "../auth/context";

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastVisibleDocs, setLastVisibleDocs] = useState({});
    const db = getFirestore();
    const { user } = useAuth()

    // Fetch data from localStorage initially
    useEffect(() => {
        try {
            const storedData = JSON.parse(localStorage.getItem("orders")) || [];
            setOrders(storedData);
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
        }
    }, []);

    // Sync orders state to localStorage
    useEffect(() => {
        localStorage.setItem("orders", JSON.stringify(orders));
    }, [orders]);

    // Function to fetch orders with filters and pagination
    const fetchOrders = async (filters = {}, limitSize = 20, nextPage = false) => {
        setLoading(true);
        try {
            const ordersRef = collection(db, "orders");
            let constraints = [limit(limitSize)];

            // Apply filters
            Object.keys(filters).forEach((key) => {
                constraints.push(where(key, "==", filters[key]));
            });

            // Apply pagination
            if (nextPage && lastVisibleDocs["orders"]) {
                constraints.push(startAfter(lastVisibleDocs["orders"]));
            }

            const ordersQuery = query(ordersRef, ...constraints);
            const snapshot = await getDocs(ordersQuery);
            const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Update last visible document for pagination
            if (snapshot.docs.length > 0) {
                setLastVisibleDocs(prev => ({
                    ...prev,
                    ["orders"]: snapshot.docs[snapshot.docs.length - 1]
                }));
            }

            // Merge with previous data for the same collection
            setOrders(prev => (nextPage ? [...prev, ...fetchedOrders] : fetchedOrders));
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Real-time listener for changes in Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
            const updatedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(updatedOrders);
        });

        return () => {
            unsubscribe();
        };
    }, [db]);

    // Fetch all orders in parallel (useful for multiple collections if needed in future)
    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            await fetchOrders({}, 20, false); // Fetch all orders initially
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrdersContext.Provider value={{ orders, fetchOrders, fetchAllOrders, loading }}>
            {children}
        </OrdersContext.Provider>
    );
};

// Custom hook to use orders
export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error("useOrders must be used within an OrdersProvider");
    }
    return context;
};
