"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ManagedChild } from "../types";
import ChildCard, { ChildCardSkeleton } from "./ChildCard";

interface ChildSliderProps {
  childrenList: ManagedChild[];
  onEditChild?: (child: ManagedChild) => void;
  onToggleStatus?: (child: ManagedChild) => void;
  togglingChildId?: string | null;
}

export const ChildSlider: React.FC<ChildSliderProps> = ({
  childrenList,
  onEditChild,
  onToggleStatus,
  togglingChildId,
}) => {
  return (
    <div className="w-full py-4 relative select-none" dir="rtl">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1.15}
        dir="rtl"
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          480: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2.2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2.7,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3.3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="w-full pt-3 px-1.5"
      >
        {childrenList.map((child) => (
          <SwiperSlide key={child.id} className="h-auto flex justify-center p-2">
            <ChildCard
              child={child}
              onEdit={onEditChild}
              onToggleStatus={onToggleStatus}
              isToggling={togglingChildId === child.id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export const ChildSliderSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="w-full py-4 relative select-none" dir="rtl">
      <div className="w-full pt-3 px-1.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className={`h-auto flex justify-center p-2 ${
              idx >= 1 ? "hidden sm:flex" : ""
            } ${idx >= 2 ? "sm:hidden md:flex" : ""} ${
              idx >= 3 ? "md:hidden xl:flex" : ""
            }`}
          >
            <ChildCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildSlider;
