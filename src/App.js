import React, { useState } from "react";
import Home from "./pages/user/home";
import "./styles/index.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import LoginModal from "./pages/auth/Login";
import OrdersPage from "./pages/user/orders";
import OrderDetailPage from "./pages/user/order-details";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentComponent from "./PaymentComponent";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function AnimatedRoutes({ toggleLoginModal }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <StaggeredWrapper>
              <Home />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/product/:id"
          element={
            <StaggeredWrapper>
              <Product />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/cart"
          element={
            <StaggeredWrapper>
              <Cart />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <StaggeredWrapper>
              <Profile />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <StaggeredWrapper>
              <Login />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <StaggeredWrapper>
              <Register />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <StaggeredWrapper>
              <ResetPass />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/new"
          element={
            <StaggeredWrapper>
              <NewArrival />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/trend"
          element={
            <StaggeredWrapper>
              <Trending />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/products/:category"
          element={
            <StaggeredWrapper>
              <Products />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/:user/orders"
          element={
            <StaggeredWrapper>
              <OrdersPage />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <StaggeredWrapper>
              <OrderDetailPage />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/collections"
          element={
            <StaggeredWrapper>
              <Collection />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/admin"
          element={
            <StaggeredWrapper>
              <AdminManagement />
            </StaggeredWrapper>
          }
        />
        <Route
          path="/unauthorized"
          element={
            <StaggeredWrapper>
              <UnauthorizedPage />
            </StaggeredWrapper>
          }
        />
        <Route
          path="*"
          element={
            <StaggeredWrapper>
              <NotFound />
            </StaggeredWrapper>
          }
        />

        {/* Private Routes (Logged-in Users) */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/checkout/:userId"
            element={
              <StaggeredWrapper>
                <Checkout />
              </StaggeredWrapper>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          {/* <Route path="/admin/dashboard" element={<StaggeredWrapper><AdminDashboard /></StaggeredWrapper>} /> */}
          <Route
            path="/admin/upload"
            element={
              <StaggeredWrapper>
                <UploadProduct />
              </StaggeredWrapper>
            }
          />
          <Route
            path="/admin/couponUpload"
            element={
              <StaggeredWrapper>
                <CouponUpload />
              </StaggeredWrapper>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const StaggeredWrapper = ({ children }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.2, ease: "easeOut" },
      },
    }}
  >
    {children}
  </motion.div>
);
function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <BrowserRouter>
          <PaymentComponent />
          <Navbar toggleLoginModal={() => setLoginModalOpen(true)} />
          <AnimatedRoutes toggleLoginModal={() => setLoginModalOpen(true)} />
          {isLoginModalOpen && (
            <LoginModal
              isOpen={isLoginModalOpen}
              setIsOpen={setLoginModalOpen}
              onClose={() => setLoginModalOpen(false)}
            />
          )}
        </BrowserRouter>
      </AuthProvider>
    </Elements>
  );
}

export default App;
