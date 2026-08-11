"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { HeroProps, HeroStatItem } from "../types";

const DEFAULT_STATS: HeroStatItem[] = [
  { id: "age-group", value: "5 - 15 سنة", label: "الفئة العمرية" },
  { id: "stories", value: "+500", label: "قصة تفاعلية" },
  { id: "readers", value: "+10,000", label: "طفل قارئ" },
  { id: "schools", value: "+50", label: "مدرسة شريكة" },
];

const Hero: React.FC<HeroProps> = ({
  title = "نصنع شغف القراءة ونبني عقول المستقبل بلغة الضاد",
  description = 'منصة "مدارك القراءة" التعليمية تقدم لأطفالكم مكتبة رقمية متكاملة تضم مئات القصص التفاعلية المصممة بإشراف خبراء لغويين لتطوير مهارات القراءة والكتابة بمتعة وأمان.',
  stats = DEFAULT_STATS,
  ctaText = "إشترك الآن",
  ctaLink = "/about",
  bgImageSrc = "/iamges/header_background.png",
  mobileBgImageSrc = "/assets/Hero-mobile-bg.png",
  sideImageSrc = "/assets/hero_image.png",
  sideImageAlt = "صورة منصة مدارك",
}) => {
  const { isMobile } = useBreakpoint();
  // useSyncExternalStore is the React-recommended way to detect the client
  // without triggering cascading renders from useEffect+setState.
  const isClient = useSyncExternalStore(
    () => () => {},   // subscribe: no external store to subscribe to
    () => true,       // getSnapshot: always true on the client
    () => false,      // getServerSnapshot: false on the server (SSR)
  );

  // Dedicated Mobile UI layout
  if (isClient && isMobile) {
    return (
      <section
        dir="rtl"
        className="w-full h-144.25 bg-cover bg-center bg-no-repeat flex items-start pt-16 sm:pt-16 justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${mobileBgImageSrc})`,
        }}
      >
        <div className="container mx-auto flex flex-col items-start px-4 sm:px-6 z-10 relative">
          {/* Mobile Content Side (70% width) */}
          <div className="w-[68%] flex items-start justify-start flex-col gap-3">
            <h1 className="text-[16px] font-bold text-white leading-tight">
              {title}
            </h1>

            <p className="text-[14px] font-normal text-white/90 leading-relaxed max-w-2xl">
              {description}
            </p>

            {/* Stats Section (Two columns on mobile) */}
            <div className="grid grid-cols-2 gap-2 py-1 w-full">
              {stats.map((stat) => (
                <div key={stat.id} className="flex items-start justify-start flex-col gap-0.5">
                  <p className="text-[14px] font-bold text-mad-third">{stat.value}</p>
                  <p className="text-[14px] font-medium text-white/90">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Call to Action Button */}
            <div className="pt-1">
              <Button
                btnLink={ctaLink}
                btnText={ctaText}
                btnType="fit"
                btnBorder="1.5px solid #ffffff"
                btnBackground="var(--mad-main)"
                btnColor="var(--mad-white-50)"
                icon="have"
                btnShadow="shadow-[inset_0_2px_6px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.2)]"
                className="font-bold text-sm px-5 py-1.5 rounded-full hover:scale-[1.02] active:scale-95 transition-all"
              />
            </div>
          </div>

          {/* Mobile Side Image (Absolute on the Left, w: 140px, h: 165px) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-35 h-41.25 flex items-center justify-center">
            <Image
              src={sideImageSrc}
              alt={sideImageAlt}
              width={140}
              height={165}
              className="w-35 h-41.25 object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </section>
    );
  }

  // Original Desktop / Tablet UI layout (Clean and unbroken for lg)
  return (
    <section
      dir="rtl"
      className="w-full min-h-screen py-16 md:py-0 bg-cover bg-center bg-no-repeat flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImageSrc})`,
      }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 px-4 sm:px-6 md:px-8 z-10">
        {/* Content Side */}
        <div className="w-full md:w-2/3 flex items-start justify-start flex-col gap-6">
          <h1 className="mad-title-1 font-bold text-white leading-tight">
            {title}
          </h1>

          <p className="mad-h5 font-normal text-white/90 leading-relaxed max-w-2xl">
            {description}
          </p>

          {/* Stats Section */}
          <div className="flex flex-wrap items-start justify-start gap-6 sm:gap-10 md:gap-12 py-2">
            {stats.map((stat) => (
              <div key={stat.id} className="flex items-start justify-start flex-col gap-1">
                <p className="mad-h3 font-bold text-mad-third">{stat.value}</p>
                <p className="mad-h6 font-medium text-white/90">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Call to Action Button */}
          <div className="pt-2">
            <Button
              btnLink={ctaLink}
              btnText={ctaText}
              btnType="fit"
              btnBorder="2px solid #ffffff"
              btnBackground="var(--mad-main)"
              btnColor="var(--mad-white-50)"
              icon="have"
              btnShadow="shadow-[inset_0_3px_8px_rgba(255,255,255,0.45),inset_0_-2px_6px_rgba(0,0,0,0.2)]"
              className="font-bold text-base px-7 py-2.5 rounded-full hover:scale-[1.02] active:scale-95 transition-all"
            />
          </div>
        </div>

        {/* Desktop Side Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Image
            src={sideImageSrc}
            alt={sideImageAlt}
            width={821}
            height={648}
            className="h-auto w-full object-contain drop-shadow-xl lg:max-w-205.25"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
