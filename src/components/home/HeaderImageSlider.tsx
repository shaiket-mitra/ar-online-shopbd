"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "../shared/LoadingSpinner";
import useAuth from "@/hooks/useAuth";

interface Slide {
  _id: string;
  imgSrc: string;
  productLink: string;
}

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;

const HeaderImageSlider = () => {
  const { sliderData } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  }, [sliderData.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  }, [sliderData.length]);

  // Autoplay
  useEffect(() => {
    if (!sliderData.length) return;
    const interval = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [sliderData.length, nextSlide]);

  // Swipe/Drag Support
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    };

    const handleMouseDown = (e: MouseEvent) => (startX = e.clientX);
    const handleMouseUp = (e: MouseEvent) => {
      endX = e.clientX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const diff = startX - endX;
      if (diff > SWIPE_THRESHOLD) nextSlide();
      else if (diff < -SWIPE_THRESHOLD) prevSlide();
    };

    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchend", handleTouchEnd);
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseup", handleMouseUp);

    return () => {
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchend", handleTouchEnd);
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseup", handleMouseUp);
    };
  }, [nextSlide, prevSlide]);

  if (sliderData.length === 0)
    return (
      <div className="text-center py-16 bg-pink-50 rounded-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full text-pink-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-700">
          No Offers Available
        </h3>
        <p className="text-gray-500 mt-2">
          We&apos;re currently baking new delicious products!
        </p>
      </div>
    );
  if (!sliderData.length) return <LoadingSpinner />;

  return (
    <div
      ref={sliderRef}
      className="relative w-full max-w-screen-2xl mx-auto mt-6 overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white cursor-grab active:cursor-grabbing select-none"
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide: Slide, index: number) => (
          <Link
            href={slide.productLink}
            key={slide._id}
            className="min-w-full bg-gradient-to-br from-[#f8f8f8] to-[#eef7f5] flex items-center justify-center aspect-[16/6]"
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.imgSrc || "/slideFallback.png"}
                alt={`Slide ${index + 1}`}
                fill
                className="object-contain transition-transform duration-500 hover:scale-105"
                priority={index === 0}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {sliderData.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 border border-white ${
              currentSlide === index
                ? "bg-[#4fbf8b] scale-125 shadow-md"
                : "bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeaderImageSlider;
