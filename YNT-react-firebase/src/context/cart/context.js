import React, {
  useReducer,
  useMemo,
  useEffect,
  createContext,
  useContext,
} from "react";
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

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {

  const getLocalStorage = (key, defaultValue) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  const userCartKey = `cart`;
  const cartItemsFromStorage = getLocalStorage(userCartKey, []);

  const initialState = {
    cartItems: cartItemsFromStorage,
    filters: getLocalStorage("filters", []),
  };

  const [state, dispatch] = useReducer(CartReducer, initialState);

  useEffect(() => {
    localStorage.setItem(userCartKey, JSON.stringify(state.cartItems));
  }, [state.cartItems, userCartKey]);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(state.filters));
  }, [state.filters]);

  // Add product to the cart with the selected size, color, and quantity
  const addToCart = (item, quantity = 1, selectedSize, selectedColor) => {
    dispatch({
      type: ADD_TO_CART,
      payload: { ...item, quantity, selectedSize, selectedColor },
    });
  };

  const removeItem = (id) => {
    dispatch({ type: REMOVE_ITEM, payload: id });
    localStorage.setItem(userCartKey, JSON.stringify(state.cartItems));
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
    localStorage.removeItem(userCartKey);
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

  // Update quantity, size, and color in the cart
  const updateQuantity = (id, quantity, selectedSize, selectedColor) => {
    if (quantity < 1) {
      removeItem(id);
    } else {
      dispatch({
        type: UPDATE_QUANTITY,
        payload: { id, quantity, selectedSize, selectedColor },
      });
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
