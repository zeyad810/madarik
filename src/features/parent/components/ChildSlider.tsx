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
  onDeleteChild?: (child: ManagedChild) => void;
  togglingChildId?: string | null;
  deletingChildId?: string | null;
}

export const ChildSlider: React.FC<ChildSliderProps> = ({
  childrenList,
  onEditChild,
  onToggleStatus,
  onDeleteChild,
  togglingChildId,
  deletingChildId,
}) => {
  return (
    <div className="w-full py-4 relative select-none" dir="rtl">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.15}
        dir="rtl"
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
              onDelete={onDeleteChild}
              isToggling={togglingChildId === child.id}
              isDeleting={deletingChildId === child.id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export { ChildSliderSkeleton } from "@/components/ui";
export default ChildSlider;
