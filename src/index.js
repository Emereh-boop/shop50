import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import CartState from "./context/cart/cart-state";
import State from "./context/State/State";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "react-query";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <State>
        <CartState>
          <App />
        </CartState>
      </State>
    </React.StrictMode>
  </QueryClientProvider>
);

reportWebVitals();
