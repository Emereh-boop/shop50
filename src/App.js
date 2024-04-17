import React from "react";
import Home from "./pages/home";
import "./index.css";
import { Route, Routes, BrowserRouter, Link } from "react-router-dom";
import ProductPage from "./pages/product-page";
import Cart from "./pages/cart";
import Register from "./components/account-register";
import Login from "./components/account-login";
import UploadData from "./pages/upload-data";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload-data" element={<UploadData />} />
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
