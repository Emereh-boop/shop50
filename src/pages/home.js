import React from "react";
import ShopProducts from "../components/layout/trendingcomp";
import NewArrivals from "../components/layout/newarrivalscomp";
import Collections from "../components/layout/collectioncomp";
import Footer from "../components/layout/footer";
import HeroPage from "../components/layout/hero";

export default function Home() {
  return (
    <div className="relative h-dvh">
      <HeroPage />
      <ShopProducts />
      <NewArrivals />
      <Collections />
      <Footer />
    </div>
  );
}
