"use client";
import { useHeaderTheme } from "@/providers/HeaderTheme";
import React, {Suspense, useEffect, useState} from "react";
import {Media as MediaType} from "@/payload-types"
import type { Page } from "@/payload-types";
import { Media } from "@/components/Media";

export const SlidingHero: React.FC<Page["hero"]> = ({ slides, timeout }) => {
  const [visibleSlide, setVisibleSlide] = useState<number>(0);
  const sliderLength = slides?.length || 0;

  useEffect(() => {
    if (sliderLength === 0) return;

    const intervalId = setInterval(() => {
      setVisibleSlide((prev) => {
        return (prev + 1) % sliderLength;
      });
    }, timeout || 4000);

    return () => clearInterval(intervalId);
  }, [sliderLength]);

  if (!sliderLength) {
    return null;
  }

  const len = slides?.length || 0;

// 1. Calculate the neighbors accurately, handling the loop (wrap-around)
  const nextIndex = (visibleSlide + 1) % len;
  const prevIndex = (visibleSlide - 1 + len) % len;

  return (
    <div className="relative -mt-28 h-screen w-full overflow-hidden text-white sm:-mt-40">
      <div className={"absolute right-10 bottom-12 sm:bottom-18 lg:bottom-16 sm:right-16 z-50 flex flex-row gap-4 sm:gap-3"}>
        {slides?.map((slide, index) => {
          const isCurrent = index === visibleSlide;
          const slideTimeout = timeout || 4000;

          return (
            <div
              key={"index_slide" + index}
              onClick={() => setVisibleSlide(index)}
              // The container acts as the track
              className="relative h-4 sm:h-3 cursor-pointer overflow-hidden rounded-lg bg-white/40 shadow-lg transition-all duration-300"
              style={{
                width: isCurrent ? "6rem " : "1.5rem",
              }}
            >
              {/* The inner div acts as the animated fill */}
              <div
                className="h-full bg-white ease-linear "
                style={{
                  width: isCurrent ? "100%" : "0%",
                  transitionProperty: "width",
                  // Animate over the timeout duration if active, snap to 0 immediately if inactive
                  transitionDuration: isCurrent ? `${slideTimeout}ms` : "0ms",
                }}
              />
            </div>
          );
        })}
      </div>
      {slides?.map((slide, index) => {

        // 2. Determine the state of this specific slide
        const isCurrent = index === visibleSlide;
        const isNext = index === nextIndex;
        const isPrev = index === prevIndex;

        // 3. Determine Position
        // If it's Previous, send it Left (-100%).
        // If it's Next (or any other future slide), send it Right (100%).
        // If it's Current, center it (0).
        let leftPosition = "100%";
        if (isCurrent) leftPosition = "0";
        else if (isPrev) leftPosition = "-100%";

        // 4. Determine Opacity
        // Only show the active loop members. Hide the rest to prevent glitches.
        const isVisible = isCurrent || isNext || isPrev;

        return (
          <div
            key={index}
            className={`absolute inset-0 h-full w-full transition-all duration-500 ease-in-out`}
            style={{
              left: leftPosition,
              opacity: isVisible ? 1 : 0,
              // Optimization: Remove pointer events from hidden slides so you can't click links on them
              pointerEvents: isCurrent ? "auto" : "none",
              zIndex: isCurrent ? "10" : "0",
            }}
          >
            <Suspense fallback={<div className={"loading-spinner"}> </div>}>
            <Slide {...slide} />
            </Suspense>
          </div>
        );
      })}
    </div>
  );
};


const Slide = ({media, title, subtitle}:{media?: MediaType | null | number, title?:string | null, subtitle?:string | null} ) =>{
  return (
    <div
      className={"relative flex h-screen items-center justify-center overflow-hidden text-white"}
      data-theme="dark"
    >
      <div className="font-base relative z-20 container mb-28 sm:mb-8 flex h-full items-end justify-start">
        <div className="pb-8 md:text-start">
          {title && (
            <h1 className="mb-6 max-w-full text-5xl font-semibold sm:max-w-2/3 md:max-w-lg md:text-7xl xl:text-8xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mb-6 max-w-full text-2xl text-balance sm:max-w-lg md:text-4xl xl:max-w-2xl xl:text-5xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="absolute inset-0 z-0 select-none">
        {/* Dark Overlay */}
        {/* Changed to absolute inset-0 to ensure it actually covers the image */}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-transparent via-70% to-transparent opacity-90"></div>

        {/* Media Component */}
        {media && (
          <Media
            fill
            resource={media}
            pictureClassName="absolute h-screen w-[160vh] left-1/2 -ml-[80vh] sm:h-full sm:w-full sm:left-0 sm:ml-0"
            imgClassName="object-cover z-0 animate-ken-burns sm:animate-none"
          />
        )}
      </div>
    </div>
  )
}
