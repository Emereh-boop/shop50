import React from "react";
import Navbar from "../components/Navbar";
import ShopProducts from "../components/ShopProducts";
import NewArrivals from "../components/new-arrivals";
import Collections from "../components/collections";
import Footer from "../components/footer";
import ShoeHeroPage from "../components/ShoeHeroPage";

export default function Home() {
  return (
    <div className="px-5 h-lvh gap-10 flex flex-col">
      <Navbar />
      <ShoeHeroPage />
      <ShopProducts />
      <NewArrivals />
      <Collections />
      <Footer />
    </div>
  );
}
