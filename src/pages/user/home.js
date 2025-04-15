import React from "react";
import ShopProducts from "../../components/layout/trendingcomp";
import NewArrivals from "../../components/layout/newarrivalscomp";
import Collections from "../../components/layout/collectioncomp";
import Footer from "../../components/layout/footer";
import HeroPage from "../../components/layout/hero";
import MostPurchased from "../../components/layout/bestsellercomp";
import Promotions from "../../components/layout/summerCollection";
import Navbar from "../../components/layout/navbar";

export default function Home() {
  return (
    <div className="mt-16 mx- auto max-w- [100rem] px- 4 sm:static md:px- 6 lg:px- 8">
      <HeroPage />
      <ShopProducts />
      <NewArrivals />
      <Promotions/>
      <MostPurchased />
      <Collections />
    </div>
  );
}
