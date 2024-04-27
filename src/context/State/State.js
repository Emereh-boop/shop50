// import { React, useState } from "react";
// import StateContext from "./State-context";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useQuery } from "@tanstack/react-query";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../../firebase";

// const State = ({ children }) => {
//   let items = [];
//   useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const data = await getDocs(collection(db, "/Products"));
//       data.docs.forEach((doc) => {
//         let key = doc.id;
//         let item = doc.data();
//         items.push({ key, item });
//       });
//     },
//   });

//   const logout = async () => {
//     await signOut(auth);
//     refreshPage();
//   };

//   return (
//     <StateContext.Provider
//       value={{
//         currentUser,
//         logout,
//         refreshPage,
//         calculateDiscount,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// export default State;
