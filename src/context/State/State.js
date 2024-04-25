import { React, useState } from "react";
import StateContext from "./State-context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const State = ({ children }) => {
  let items = [];
  const [currentUser, setCurrentUser] = useState({});
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await getDocs(collection(db, "/Products"));
      data.docs.forEach((doc) => {
        let key = doc.id;
        let item = doc.data();
        items.push({ key, item });
      });
    },
  });

  const logout = async () => {
    await signOut(auth);
    refreshPage();
  };
  onAuthStateChanged(auth, (currentUser) => {
    setCurrentUser(currentUser);
  });
  function refreshPage() {
    window.location.reload(false); // Set to true for a full server refresh
  }
  function calculateDiscount(originalPrice, discountPercentage) {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  }

  return (
    <StateContext.Provider
      value={{
        currentUser,
        logout,
        refreshPage,
        calculateDiscount,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default State;
