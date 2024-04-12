import React from "react";
import Navbar from "../components/Navbar";
import Section1 from "../components/Section-1";
import ShopProducts from "../components/ShopProducts";
import NewArrivals from "../components/new-arrivals";
import Collections from "../components/collections";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className="bg-black w-svw h-dvh">
      <Navbar />
      <Section1 />
      <ShopProducts />
      <NewArrivals />
      <Collections />
      <Footer />
    </div>
  );
}
