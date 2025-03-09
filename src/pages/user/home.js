import React from "react";
import ShopProducts from "../../components/layout/trendingcomp";
import NewArrivals from "../../components/layout/newarrivalscomp";
import Collections from "../../components/layout/collectioncomp";
import Footer from "../../components/layout/footer";
import HeroPage from "../../components/layout/hero";
import MostPurchased from "../../components/layout/bestsellercomp";
import Promotions from "../../components/layout/summerCollection";

export default function Home() {
  return (
    <div className="relative h-dvh mt-16">
      <HeroPage />
      <ShopProducts />
      <NewArrivals />
      <Promotions/>
      <MostPurchased />
      <Collections />
      <Footer />
    </div>
  );
}
