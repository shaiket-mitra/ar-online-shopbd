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
  const startXRef = useRef(0);

  const slides: Slide[] = Array.isArray(sliderData) ? sliderData : [];
  const isLoading = sliderData === undefined || sliderData === null;
  const hasSlides = slides.length > 0;
  const hasMultipleSlides = slides.length > 1;

  const nextSlide = useCallback(() => {
    if (!hasMultipleSlides) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [hasMultipleSlides, slides.length]);

  const prevSlide = useCallback(() => {
    if (!hasMultipleSlides) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [hasMultipleSlides, slides.length]);

  // যদি slide count কমে যায় আর currentSlide out of range হয়ে যায়
  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  // Autoplay
  useEffect(() => {
    if (!hasMultipleSlides) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [hasMultipleSlides, nextSlide]);

  // Swipe / Drag Support
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !hasMultipleSlides) return;

    const handleSwipe = (endX: number) => {
      const diff = startXRef.current - endX;

      if (diff > SWIPE_THRESHOLD) {
        nextSlide();
      } else if (diff < -SWIPE_THRESHOLD) {
        prevSlide();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      handleSwipe(e.changedTouches[0].clientX);
    };

    const handleMouseDown = (e: MouseEvent) => {
      startXRef.current = e.clientX;
    };

    const handleMouseUp = (e: MouseEvent) => {
      handleSwipe(e.clientX);
    };

    slider.addEventListener("touchstart", handleTouchStart, { passive: true });
    slider.addEventListener("touchend", handleTouchEnd);
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseup", handleMouseUp);

    return () => {
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchend", handleTouchEnd);
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hasMultipleSlides, nextSlide, prevSlide]);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Empty state
  if (!hasSlides) {
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
  }

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
        {slides.map((slide, index) => (
          <Link
            href={slide.productLink || "#"}
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
      {hasMultipleSlides && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 border border-white ${
                currentSlide === index
                  ? "bg-[#4fbf8b] scale-125 shadow-md"
                  : "bg-white/60 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderImageSlider;