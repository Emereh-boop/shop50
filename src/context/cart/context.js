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

  const getLocalStorage = (key, defaultValue) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return defaultValue;
    }
  };

  const userCartKey = user ? `cartItems_${user.uid}` : "cartItems_guest";
  const cartItemsFromStorage = getLocalStorage(userCartKey, []);

  const initialState = {
    cartItems: cartItemsFromStorage,
    filters: getLocalStorage("filters", []),
  };

  const [state, dispatch] = useReducer(CartReducer, initialState);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cartItems_${user.uid}`, JSON.stringify(state.cartItems));
    } else {
      localStorage.setItem("cartItems_guest", JSON.stringify(state.cartItems));
    }
  }, [state.cartItems, user]);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(state.filters));
  }, [state.filters]);

  const addToCart = (item, quantity = 1) => {
    dispatch({ type: ADD_TO_CART, payload: { ...item, quantity } });
  };

  const removeItem = (id) => {
    dispatch({ type: REMOVE_ITEM, payload: id });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
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

// ✅ Now exporting CartProvider correctly
export default CartContext;
