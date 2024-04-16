import React from "react";
import Home from "./pages/home";
import "./index.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ProductPage from "./pages/product-page";
import Cart from "./pages/cart";
import Register from "./components/account-register";
import Login from "./components/account-login";
import UploadData from "./pages/upload-data";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload-data" element={<UploadData />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
