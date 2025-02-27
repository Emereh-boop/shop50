import React from "react";
import Home from "./pages/user/home";
import "./styles/index.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Cart from "./pages/user/cart";
import NotFound from "./components/layout/not-found";
import Products from "./pages/user/products";
import Collection from "./pages/user/collection";
import NewArrival from "./pages/user/new-arrival";
import Navbar from "./components/layout/navbar";
import ResetPass from "./pages/auth/ResetPass";
import Trending from "./pages/user/trend";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import Product from "./pages/user/product-detail";
import Checkout from "./pages/user/checkout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminManagement from "./pages/admin/admin";
import UnauthorizedPage from "./pages/auth/un-auth";
// import AdminDashboard from "./pages/admin/dashboard";
import UploadProduct from "./pages/admin/upload";
import CouponUpload from "./pages/admin/coupon";
import { AuthProvider } from "./context/auth/context";
import Profile from "./pages/user/profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar /> {/* Navbar added here so it's always visible */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ResetPass />} />
          <Route path="/new" element={<NewArrival />} />
          <Route path="/trend" element={<Trending />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/:user/orders" element={<Products />} />
          <Route path="/collections" element={<Collection />} />
          <Route path="/admin" element={<AdminManagement />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFound />} />

          {/* Private Routes (Logged-in Users) */}
          <Route element={<PrivateRoute />}>
            <Route path="/checkout/:userId" element={<Checkout />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
            <Route path="/admin/upload" element={<UploadProduct />} />
            <Route path="/admin/couponUpload" element={<CouponUpload />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
