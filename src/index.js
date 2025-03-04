import React from "react";
import ReactDOM from "react-dom/client";
import ErrorBoundary from "./utils/errorboundry.js";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./pages/reportWebVitals.js";
import { CartProvider } from "./context/cart/context.js";
import { UserProvider } from "./context/user/context";
import { ProductProvider } from "./context/products/context.js";
import { AuthProvider } from "./context/auth/context"; // Import AuthProvider
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "react-query";
import { OrdersProvider } from "./context/orders/context.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <ProductProvider>
              <OrdersProvider>
              <React.StrictMode>
                <App />
              </React.StrictMode>
              </OrdersProvider>
            </ProductProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

reportWebVitals();
