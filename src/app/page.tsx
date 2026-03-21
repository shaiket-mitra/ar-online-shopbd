"use client";

import ContectUsSec from "@/components/home/ContectUsSec";
import HeaderImageSlider from "@/components/home/HeaderImageSlider";
import OurStorySec from "@/components/home/OurStorySec";
import Products from "@/components/home/Products";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      {/* Mobile: small margins, larger screens: proportional padding */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-2 md:py-5">
        <HeaderImageSlider />
        <Products />
        <OurStorySec />
        <ContectUsSec />
      </div>
    </div>
  );
}
