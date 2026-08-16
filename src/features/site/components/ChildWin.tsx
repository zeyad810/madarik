"use client";

import React from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { ChildWinProps, ChildWinCardItem } from "../types";
import { ChildWinCard } from "./ChildWinCard";

const ChildWin: React.FC<ChildWinProps> = ({
  title: propTitle,
  description: propDescription,
  bgImageSrc = "/assets/win-bg.png",
  cards: propCards,
}) => {
  const { data: benefitsData } = usePublicLanding({
    select: (res) => res.data?.child_benefits_section,
  });

  const title = propTitle ?? benefitsData?.title ?? "";
  const description = propDescription ?? benefitsData?.subtitle ?? "";

  const cards: ChildWinCardItem[] =
    propCards ??
    (benefitsData?.items?.map((item, idx) => ({
      id: idx + 1,
      number: `0${idx + 1}`,
      title: item.title,
      description: item.description,
    })) ?? []);

  return (
    <>
      {/* Section Header outside the section container */}
      <div className="w-full pt-12 md:pt-16 pb-6 px-4 md:px-8 bg-white">
        <SectionHeader
          title={title}
          description={description}
          align="center"
          className="max-w-3xl mx-auto"
        />
      </div>

      <section
        dir="rtl"
        className="relative w-full h-auto lg:h-[900px] section-spacing px-4 md:px-8 bg-[#FBF9FF] overflow-hidden flex items-center justify-center"
      >
        {/* Background Graphic Illustration (Desktop only center background) */}
        <div className="hidden lg:flex absolute inset-0 z-0 pointer-events-none items-center justify-center">
          <Image
            src={bgImageSrc}
            alt="Background Illustration"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-95"
            priority
          />
        </div>

        <div className="container mx-auto relative z-10 flex flex-col items-center">
          {/* Mobile Character Illustration Card */}
          <div className="lg:hidden relative w-full max-w-sm mx-auto h-[260px] sm:h-[320px] rounded-3xl overflow-hidden mb-10 border border-purple-100/80 bg-linear-to-b from-[#F5F1FF] via-[#FAF8FF] to-[#EFE8FF] shadow-sm flex items-center justify-center">
            <Image
              src={bgImageSrc}
              alt="Character Illustration"
              width={340}
              height={300}
              className="w-full h-full object-cover drop-shadow-md"
              priority
            />
          </div>

          {/* Cards Layout */}
          <div className="w-full flex flex-col gap-8 sm:gap-10 lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 lg:items-center min-h-[480px]">
            {/* Card 01: Top Right (RTL Col 1) */}
            {cards[0] && (
              <div className="w-full lg:col-span-4 lg:col-start-1 lg:row-start-1">
                <ChildWinCard item={cards[0]} />
              </div>
            )}

            {/* Card 02: Top Left (RTL Col 3) */}
            {cards[1] && (
              <div className="w-full lg:col-span-4 lg:col-start-9 lg:row-start-1">
                <ChildWinCard item={cards[1]} />
              </div>
            )}

            {/* Card 03: Bottom Right (RTL Col 1) */}
            {cards[2] && (
              <div className="w-full lg:col-span-4 lg:col-start-1 lg:row-start-2">
                <ChildWinCard item={cards[2]} />
              </div>
            )}

            {/* Card 04: Bottom Left (RTL Col 3) */}
            {cards[3] && (
              <div className="w-full lg:col-span-4 lg:col-start-9 lg:row-start-2">
                <ChildWinCard item={cards[3]} />
              </div>
            )}

            {/* Center Spacer for Boy Character Illustration on Desktop */}
            <div className="hidden lg:flex lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:row-span-2 items-center justify-center min-h-[380px] pointer-events-none" />
          </div>
        </div>
      </section>
    </>
  );
};

export default ChildWin;