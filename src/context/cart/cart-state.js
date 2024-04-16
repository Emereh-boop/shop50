import { React, useReducer, useEffect } from "react";
import ShopContext from "./shop-context";
import CartReducer from "./cart-reducer";
import { SHOW_HIDE_CART, ADD_TO_CART, REMOVE_ITEM } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const CartState = ({ children }) => {
  const cartItemsFromStorage = localStorage.getItem("cartItems");
  let c = cartItemsFromStorage ? JSON.parse(cartItemsFromStorage) : [];
  let items = [];

  const initialState = {
    showCart: false,
    products: items,
    cartItems: c,
  };
  const { q } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await getDocs(collection(db, "/products"));
      data.docs.forEach((doc) => {
        let key = doc.id;
        let item = doc.data();
        items.push({ key, item });
      });
    },
  });

  const [state, dispatch] = useReducer(CartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addToCart = (item) => {
    dispatch({ type: ADD_TO_CART, payload: item });
  };
  const showHideCart = () => {
    dispatch({ type: SHOW_HIDE_CART });
  };
  const removeItem = (id) => {
    dispatch({ type: REMOVE_ITEM, payload: id });
    alert("Remove item");
  };
  const logout = async () => {
    await signOut(auth);
    alert("logged out!");
  };
  return (
    <ShopContext.Provider
      value={{
        showCart: state.showCart,
        products: state.products,
        cartItem: state.cartItems,
        addToCart,
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
