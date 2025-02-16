import React, { useReducer, useMemo, useEffect } from "react";
import ShopContext from "./shop-context";
import CartReducer from "./cart-reducer";
import {
  ADD_TO_CART,
  ADD_FILTER,
  REMOVE_ITEM,
  REMOVE_FILTER,
  CLEAR_CART,
  CLEAR_FILTER,
  SET_ALL_DATA,
  SET_USER,
} from "../types";
import { collection, getDocs, query } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import { signOut, onAuthStateChanged } from "firebase/auth";

const CartState = ({ children }) => {
  const collectionFromStorage =
    JSON.parse(localStorage.getItem("allCollections")) || [];
  const filtersFromStorage = JSON.parse(localStorage.getItem("filters")) || [];
  const cartItemsFromStorage =
    JSON.parse(localStorage.getItem("cartItems")) || [];

  const initialState = {
    showCart: false,
    products: collectionFromStorage,
    cartItems: cartItemsFromStorage,
    filters: filtersFromStorage,
    currentUser: null,
  };

  const [state, dispatch] = useReducer(CartReducer, initialState);
  const { error, isLoading } = useQuery({
    queryKey: ["allCollections"],
    queryFn: async () => {
      const productsQuery = query(collection(db, "products"));
      const collectionsQuery = query(collection(db, "collections"));
      const newArrivalsQuery = query(collection(db, "newArrivals"));
      const trendingQuery = query(collection(db, "trending"));
      const bannersQuery = query(collection(db, "banners"));

      // Fetch data in parallel
      const [
        productsData,
        collectionsData,
        newArrivalsData,
        trendingData,
        bannersData,
      ] = await Promise.all([
        getDocs(productsQuery),
        getDocs(collectionsQuery),
        getDocs(newArrivalsQuery),
        getDocs(trendingQuery),
        getDocs(bannersQuery),
      ]);

      // Format documents
      const formattedCollections = {
        products: productsData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        collections: collectionsData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        banners: bannersData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        newArrivals: newArrivalsData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        trending: trendingData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
      // Store all data
      localStorage.setItem(
        "allCollections",
        JSON.stringify(formattedCollections)
      );

      dispatch({ type: SET_ALL_DATA, payload: formattedCollections });

      return formattedCollections;
    },

    staleTime: 200000,
    cacheTime: 43200000,
    refetchInterval: 43200000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(state.filters));
  }, [state.filters]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: SET_USER, payload: user });
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item) => {
    dispatch({ type: ADD_TO_CART, payload: item });
  };
  const removeItem = (id) => {
    dispatch({ type: REMOVE_ITEM, payload: id });
  };
  const addFilter = (item) => {
    dispatch({ type: ADD_FILTER, payload: item });
  };
  const removeFilter = (item) => {
    dispatch({ type: REMOVE_FILTER, payload: item });
  };
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const calculateDiscount = (price, discount) => {
    return price - (price * discount) / 100;
  };
  const memoizedCartItems = useMemo(() => state.cartItems, [state.cartItems]);
  const memoizedFilter = useMemo(() => state.filters, [state.filters]);

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: SET_USER, payload: null });
    } catch (error) {
      return error;
    }
  };
  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products.</div>;
  }

  return (
    <ShopContext.Provider
      value={{
        showCart: state.showCart,
        products: state.products,
        cartItems: state.cartItems,
        currentUser: state.currentUser,
        memoizedCartItems,
        memoizedFilter,
        addToCart,
        addFilter,
        calculateDiscount,
        clearCart,
        clearFilter,
        removeItem,
        removeFilter,
        logout,
        formatCurrency,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default CartState;
