import { React, useReducer, useEffect, useState } from "react";
import ShopContext from "./shop-context";
import CartReducer from "./cart-reducer";
import { SHOW_HIDE_CART, ADD_TO_CART, REMOVE_ITEM, CLEAR_CART } from "../types";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import { GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const CartState = ({ children }) => {
  const cartItemsFromStorage = localStorage.getItem("cartItems");
  let c = cartItemsFromStorage ? JSON.parse(cartItemsFromStorage) : [];
  const [items, setItems] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  const initialState = {
    showCart: false,
    products: items,
    cartItems: c,
  };
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const first = query(
        collection(db, "Products"),
        orderBy("title"),
        limit(10)
      );
      const data = await getDocs(first);
      data.docs.forEach((doc) => {
        let key = doc.id;
        let item = doc.data();
        items.push({ key, item });
      });
      setItems(data.docs);
    },
  });

  const [state, dispatch] = useReducer(CartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addToCart = (item) => {
    dispatch({ type: ADD_TO_CART, payload: item });
  };
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };
  const showHideCart = () => {
    dispatch({ type: SHOW_HIDE_CART });
  };
  const removeItem = (id) => {
    dispatch({ type: REMOVE_ITEM, payload: id });
  };
  function refreshPage() {
    window.location.reload(false); // Set to true for a full server refresh
  }
  const logout = async () => {
    await signOut(auth);
    refreshPage();
  };

  const googleProvider = new GoogleAuthProvider();

  onAuthStateChanged(auth, (currentUser) => {
    setCurrentUser(currentUser);
  });
  function calculateDiscount(originalPrice, discountPercentage) {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  }

  return (
    <ShopContext.Provider
      value={{
        showCart: state.showCart,
        products: state.products,
        cartItem: state.cartItems,
        currentUser,
        addToCart,
        calculateDiscount,
        clearCart,
        showHideCart,
        removeItem,
        logout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default CartState;
