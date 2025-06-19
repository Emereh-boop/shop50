// src/shipping/ShippingContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const ShippingContext = createContext(null);

const SHIPPING_CACHE_KEY = "cachedShippingData";
const CACHE_DURATION = 3000; // 24 hours in milliseconds

export const ShippingProvider = ({ children }) => {
    const [shippingData, setShippingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const db = getFirestore();

    // Helper: Check if cache is still valid
    const isCacheValid = (timestamp) => {
        const now = new Date().getTime();
        return now - timestamp < CACHE_DURATION;
    };

    // Load from cache initially
    useEffect(() => {
        const cached = localStorage.getItem(SHIPPING_CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.timestamp && isCacheValid(parsed.timestamp)) {
                setShippingData(parsed.data);
                return; //  valid cache found
            }
        }
        fetchShippingData(); //  No valid cache, fetch from Firestore
    }, []);

    // Fetch shipping data from Firestore and cache it
    const fetchShippingData = async () => {
        setLoading(true);
        try {
            const ref = collection(db, "shipping_data");
            const snapshot = await getDocs(ref);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setShippingData(data);
            localStorage.setItem(SHIPPING_CACHE_KEY, JSON.stringify({
                timestamp: new Date().getTime(),
                data
            }));
        } catch (err) {
            console.error("Failed to fetch shipping data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ShippingContext.Provider value={{ shippingData, fetchShippingData, loading }}>
            {children}
        </ShippingContext.Provider>
    );
};

export const useShipping = () => {
    const context = useContext(ShippingContext);
    if (!context) {
        throw new Error("useShipping must be used within a ShippingProvider");
    }
    return context;
};
