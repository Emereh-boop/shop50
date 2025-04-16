import React, { lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { useProducts } from "../../context/products/context";
import { LandingPageSkeleton } from "../../components/skeletons/LandingPageSkeleton";

// Lazy loaded components
const HeroPage = lazy(() => import("../../components/layout/hero"));
const ShopProducts = lazy(() => import("../../components/layout/trendingcomp"));
const NewArrivals = lazy(() =>
  import("../../components/layout/newarrivalscomp")
);
const Promotions = lazy(() =>
  import("../../components/layout/summerCollection")
);
const MostPurchased = lazy(() =>
  import("../../components/layout/bestsellercomp")
);
const Collections = lazy(() =>
  import("../../components/layout/collectioncomp")
);

export default function Home() {
  const LazyLoadSection = ({ children }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
      <div ref={ref}>
        {inView && (
          <Suspense fallback={<div className="h-40">Loading section...</div>}>
            {children}
          </Suspense>
        )}
      </div>
    );
  };

  const { products = {} } = useProducts();
  const isLoading = products?.banners?.length <0 || products?.products?.length <0 || products?.promotions?.length < 0;

  return (
    <>
      {isLoading ? (
        <LandingPageSkeleton />
      ) : (
        <div className="mt-16 mx-auto max-w-[100rem] px-4 md:px-6 lg:px-8">
          <Suspense fallback={<div className="h-40">Loading hero...</div>}>
            <HeroPage />
          </Suspense>

          <LazyLoadSection>
            <ShopProducts />
          </LazyLoadSection>

          <LazyLoadSection>
            <NewArrivals />
          </LazyLoadSection>

          <LazyLoadSection>
            <Promotions />
          </LazyLoadSection>

          <LazyLoadSection>
            <MostPurchased />
          </LazyLoadSection>

          <LazyLoadSection>
            <Collections />
          </LazyLoadSection>
        </div>
      )}
    </>
  );
}
