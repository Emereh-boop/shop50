import React, { useContext } from "react";
import Home from "./pages/home";
import "./index.css";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import ProductPage from "./pages/product-page";
import Cart from "./pages/cart";
import Register from "./components/account-register";
import Login from "./components/account-login";
import UploadData from "./pages/upload-data";
import Navbar from "./components/Navbar";
import StateContext from "./context/State/State-context";
function App() {
  const { currentUser } = useContext(StateContext);
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
          <Route index element={<Home />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
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

                <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                  <div className="text-center">
                    <p className="text-base font-semibold text-neutral-600">
                      404
                    </p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                      Page not found
                    </h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                      Sorry, we couldn’t find the page you’re looking for.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                      <a
                        href="/"
                        className="rounded-md bg-neutral-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Go back home
                      </a>
                      <a
                        href="/support"
                        className="text-sm font-semibold text-gray-900"
                      >
                        Contact support <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </main>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
