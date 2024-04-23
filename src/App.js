import React, { useContext } from "react";
import Home from "./pages/home";
import "./index.css";
import { Route, Routes, BrowserRouter, Link, Navigate } from "react-router-dom";
import ProductPage from "./pages/product-page";
import Cart from "./pages/cart";
import Register from "./components/account-register";
import Login from "./components/account-login";
import UploadData from "./pages/upload-data";
import Navbar from "./components/Navbar";
import ShopContext from "./context/cart/shop-context";
function App() {
  const { currentUser } = useContext(ShopContext);
  const RequireAuth = ({ children }) => {
    const user = currentUser;
    return user ? children : <Navigate to={"/login"} />;
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            index
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/products"
            element={
              <RequireAuth>
                <ProductPage />
              </RequireAuth>
            }
          />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <Cart />
              </RequireAuth>
            }
          />
          <Route
            path="/upload-data"
            element={
              <RequireAuth>
                <UploadData />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={
              <div className="text-center ">
                <Navbar />
                <div className=" text-4xl text center md:text-8xl">404</div>
                <div className="text-xl">
                  <span className="font-black">Error</span>: wepage not found
                </div>
                <Link
                  className="text-blue-600 underline underline-offset-2"
                  to="/"
                >
                  click here to return home
                </Link>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
