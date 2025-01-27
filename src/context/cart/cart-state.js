import React, { useReducer, useMemo, useEffect } from "react";
import ShopContext from "./shop-context";
import CartReducer from "./cart-reducer";
import {
  ADD_TO_CART,
  REMOVE_ITEM,
  // SHOW_HIDE_CART,
  CLEAR_CART,
  SET_PRODUCTS,
  SET_USER,
} from "../types";
import { collection, getDocs, query } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import { signOut, onAuthStateChanged } from "firebase/auth";

const CartState = ({ children }) => {
  const productsFromStorage =
    JSON.parse(localStorage.getItem("products")) || [];
  const cartItemsFromStorage =
    JSON.parse(localStorage.getItem("cartItems")) || [];

  const initialState = {
    showCart: false,
    products: productsFromStorage,
    cartItems: cartItemsFromStorage,
    currentUser: null,
  };

  const [state, dispatch] = useReducer(CartReducer, initialState);
  const { error, isLoading } = useQuery({
    queryKey: ["newArrivals"],
    queryFn: async () => {
      const productsQuery = query(collection(db, "newArrivals"));
      const data = await getDocs(productsQuery);
      const products = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Cache the fetched products in localStorage
      localStorage.setItem("products", JSON.stringify(products));

      dispatch({ type: SET_PRODUCTS, payload: products });
      console.log("Fetched products:");

      return products;
    },
    onSuccess: (products) => {
      // Update the cart state with the fetched products
      dispatch({ type: SET_PRODUCTS, payload: products });
    },
    onError: (error) => {
      // Log any errors to the console for debugging
      console.error("Error fetching products:", error);
    },
    staleTime: 200000, // Forces refetch on every query, disables stale data
    cacheTime: 43200000, // Cache data for 12 hours
    refetchInterval: 43200000, // Refetch products every 10 seconds
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

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

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const calculateDiscount = (price, discount) => {
    return price - (price * discount) / 100;
  };
  const memoizedCartItems = useMemo(() => state.cartItems, [state.cartItems]);

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: SET_USER, payload: null });
    } catch (error) {
      return error;
    }
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
        addToCart,
        calculateDiscount,
        clearCart,
        removeItem,
        logout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default CartState;
