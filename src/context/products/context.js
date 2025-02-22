import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, limit, startAfter } from "firebase/firestore";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastVisibleDocs, setLastVisibleDocs] = useState({});
  const db = getFirestore();

  // Helper function to get data from localStorage
  const getLocalStorage = (key, defaultValue) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return defaultValue;
    }
  };

  // Load data from localStorage initially
  useEffect(() => {
    const storedData = getLocalStorage("allCollections", {});
    setProducts(storedData);
  }, []);

  // Function to fetch a collection with filtering & pagination
  const fetchProducts = async (collectionName, filters = {}, limitSize = 20, nextPage = false) => {
    setLoading(true);
    try {
      let collectionRef = collection(db, collectionName);
      let productQuery = query(collectionRef, limit(limitSize));

      // Apply filters
      Object.keys(filters).forEach((key) => {
        productQuery = query(productQuery, where(key, "==", filters[key]));
      });

      // Apply pagination
      if (nextPage && lastVisibleDocs[collectionName]) {
        productQuery = query(productQuery, startAfter(lastVisibleDocs[collectionName]), limit(limitSize));
      }

      // Fetch documents
      const snapshot = await getDocs(productQuery);
      const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Update last visible document for pagination
      if (snapshot.docs.length > 0) {
        setLastVisibleDocs(prev => ({
          ...prev,
          [collectionName]: snapshot.docs[snapshot.docs.length - 1]
        }));
      }

      // Merge with previous data for the same collection
      setProducts(prev => ({
        ...prev,
        [collectionName]: nextPage ? [...(prev[collectionName] || []), ...fetchedData] : fetchedData
      }));

      // Store in localStorage for caching
      localStorage.setItem("allCollections", JSON.stringify(products));
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all collections in parallel (like old method)
  const fetchAllCollections = async () => {
    setLoading(true);
    try {
      const collectionNames = ["products", "collections", "newArrivals", "trending", "banners"];
      const fetchPromises = collectionNames.map(name => fetchProducts(name, {}, 20, false));

      await Promise.all(fetchPromises);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ products, fetchProducts, fetchAllCollections, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use products
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
