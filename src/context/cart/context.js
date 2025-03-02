import React, { useReducer, useMemo, useEffect, createContext, useContext } from "react";
import CartReducer from "./reducer";
import {
  ADD_TO_CART,
  REMOVE_ITEM,
  CLEAR_CART,
  ADD_FILTER,
  REMOVE_FILTER,
  CLEAR_FILTER,
  UPDATE_QUANTITY,
} from "../types";
import { useAuth } from "../auth/context";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Get cart items from localStorage
  const getLocalStorage = (key, defaultValue) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return defaultValue;
    }
  };

  // User-specific key
  const userCartKey = user ? `cartItems_${user.uid}` : "cartItems_guest";
  const cartItemsFromStorage = getLocalStorage(userCartKey, []);

  // Initial state for the cart
  const initialState = {
    cartItems: cartItemsFromStorage,
    filters: getLocalStorage("filters", []),
  };

  const [state, dispatch] = useReducer(CartReducer, initialState);

  // Save cart to localStorage when cartItems or user changes
  useEffect(() => {
    if (user) {
      // For logged-in users, save to their user-specific key
      localStorage.setItem(userCartKey, JSON.stringify(state.cartItems));
    } else {
      // For guests, save to the guest cart key
      localStorage.setItem("cartItems_guest", JSON.stringify(state.cartItems));
    }
  }, [state.cartItems, user, userCartKey]);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(state.filters));
  }, [state.filters]);

  const addToCart = (item, quantity = 1) => {
    dispatch({ type: ADD_TO_CART, payload: { ...item, quantity } });
  };

  const removeItem = (id) => {
    
    // Dispatch the action to remove the item
    dispatch({ type: REMOVE_ITEM, payload: id });
    // After removing the item from the state, update localStorage
    if (user) {
      // Update the cartItems for the logged-in user
      localStorage.setItem("cartItems_guest", JSON.stringify(state.cartItems));
      localStorage.setItem(userCartKey, JSON.stringify(state.cartItems));
    } else {
      // Update the guest cart
      localStorage.setItem("cartItems_guest", JSON.stringify(state.cartItems));
    }
};

  const clearCart = () => {
    
    // Dispatch the action to clear the cart
    dispatch({ type: CLEAR_CART });
    // Also clear cart from localStorage
    if (user) {
      localStorage.removeItem("cartItems_guest"); // Clear guest cart
      localStorage.removeItem(userCartKey); // Clear logged-in user cart
    } else {
      localStorage.removeItem("cartItems_guest"); // Clear guest cart
    }
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

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeItem(id);
    } else {
      dispatch({ type: UPDATE_QUANTITY, payload: { id, quantity } });
    }
  };

  const memoizedCartItems = useMemo(() => state.cartItems, [state.cartItems]);
  const memoizedFilters = useMemo(() => state.filters, [state.filters]);

  return (
    <CartContext.Provider
      value={{
        cartItems: memoizedCartItems,
        filters: memoizedFilters,
        addToCart,
        removeItem,
        clearCart,
        addFilter,
        removeFilter,
        clearFilter,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
