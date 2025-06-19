import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  getFirestore, collection, query, where, getDocs, limit, startAfter, onSnapshot 
} from "firebase/firestore";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastVisibleDocs, setLastVisibleDocs] = useState({});
  const db = getFirestore();

  // Load data from localStorage initially
  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("allCollections")) || {};
      setProducts(storedData);
    } catch (error) {
    }
  }, []);

  // Sync products state to localStorage
  useEffect(() => {
    localStorage.setItem("allCollections", JSON.stringify(products));
  }, [products]);

  // Function to fetch a collection with filtering & pagination
  const fetchProducts = async (collectionName, filters = {}, limitSize = 20, nextPage = false) => {
    setLoading(true);
    try {
      const collectionRef = collection(db, collectionName);
      let constraints = [limit(limitSize)];

      // Apply filters
      Object.keys(filters).forEach((key) => {
        constraints.push(where(key, "==", filters[key]));
      });

      // Apply pagination
      if (nextPage && lastVisibleDocs[collectionName]) {
        constraints.push(startAfter(lastVisibleDocs[collectionName]));
      }

      const productQuery = query(collectionRef, ...constraints);
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
        [collectionName]: nextPage
          ? [...(prev[collectionName] || []), ...fetchedData]
          : fetchedData
      }));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Real-time listener for changes in Firestore
  useEffect(() => {
    const collectionNames = ["products", "banners"];
    const unsubscribers = [];

    collectionNames.forEach((collectionName) => {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setProducts(prev => ({
          ...prev,
          [collectionName]: updatedData
        }));

      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [db]);

  // Fetch all collections in parallel
  const fetchAllCollections = async () => {
    setLoading(true);
    try {
      const collectionNames = ["products", "banners"];
      await Promise.all(collectionNames.map(name => fetchProducts(name, {}, 20, false)));
    } catch (error) {
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
