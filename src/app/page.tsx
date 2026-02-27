"use client";

import Banner from "@/components/home/Banner";
import ContectUsSec from "@/components/home/ContectUsSec";
import OurStorySec from "@/components/home/OurStorySec";
import Products from "@/components/home/Products";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const HeaderImageSlider = dynamic(
  () => import("@/components/home/HeaderImageSlider"),
  { ssr: false },
);

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      {/* Mobile: small margins, larger screens: proportional padding */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-2 md:py-5">
        <Suspense fallback={<LoadingSpinner />}>
          <HeaderImageSlider />
        </Suspense>
        <Products />
        <OurStorySec />
        <ContectUsSec />
      </div>
    </div>
  );
}
