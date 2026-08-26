"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { HeroProps, HeroStatItem } from "../types";

const Hero: React.FC<HeroProps> = ({
  id: propId,
  title: propTitle,
  description: propDescription,
  stats: propStats,
  ctaText = "إشترك الآن",
  ctaLink = "/about",
  bgImageSrc = "/assets/Hero_bg.png",
  mobileBgImageSrc = "/assets/Hero-mobile-bg.png",
  sideImageSrc = "/assets/hero_image.png",
  sideImageAlt = "صورة منصة مدارك",
}) => {
  const { data: heroData } = usePublicLanding({
    select: (res) => res.data?.hero_banner,
  });

  const id = propId ?? heroData?.id;
  const title = propTitle ?? heroData?.title ?? "";
  const description = propDescription ?? heroData?.subtitle ?? "";
  const stats: HeroStatItem[] =
    propStats ??
    (heroData?.stats?.map((stat, idx) => ({
      id: idx,
      value: stat.value,
      label: stat.label,
    })) ?? []);
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
        id={id}
        className="w-full h-144.25 bg-cover bg-center bg-no-repeat flex items-start pt-20 sm:pt-24 justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${mobileBgImageSrc})`,
        }}
      >
        <div className="container mx-auto flex flex-col items-start px-4 sm:px-6 z-10 relative">
          {/* Mobile Content Side (70% width) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-[68%] flex items-start justify-start flex-col gap-3"
          >
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[15px] font-bold text-white leading-tight"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[13px] font-normal text-white/90 leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>

            {/* Stats Section (Two columns on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-2 py-1 w-full"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                  className="flex items-start justify-start flex-col gap-0.5"
                >
                  <p className="text-[13px] font-bold text-mad-third">{stat.value}</p>
                  <p className="text-[12px] font-medium text-white/90">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-1"
            >
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
            </motion.div>
          </motion.div>

          {/* Mobile Side Image (Absolute on the Left, w: 140px, h: 165px) */}
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-35 h-41.25 flex items-center justify-center"
          >
            <Image
              src={sideImageSrc}
              alt={sideImageAlt}
              width={140}
              height={165}
              style={{ width: "100%", height: "auto" }}
              className="max-h-41.25 object-contain drop-shadow-xl"
              loading="eager"
            />
          </motion.div>
        </div>
      </section>
    );
  }

  // Original Desktop / Tablet UI layout (Clean and unbroken for lg)
  return (
    <section
      dir="rtl"
      id={id}
      className="w-full min-h-screen lg:h-[1400px] lg:min-h-[1400px] pt-32 sm:pt-40 lg:pt-52 pb-16 lg:pb-24 bg-cover bg-center bg-no-repeat flex items-start justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImageSrc})`,
      }}
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 px-4 sm:px-6 lg:px-12 z-10">
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex items-start justify-start flex-col gap-6 lg:gap-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mad-title-2 font-bold text-white leading-tight"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mad-h6 font-normal text-white/90 leading-relaxed max-w-2xl"
          >
            {description}
          </motion.p>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-start justify-start gap-6 sm:gap-10 lg:gap-14 py-2"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.35 + idx * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                className="flex items-start justify-start flex-col gap-1 transition-transform"
              >
                <p className="mad-h4 font-bold text-mad-third">{stat.value}</p>
                <p className="mad-body-2 font-medium text-white/90">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="pt-2"
          >
            <Button
              btnLink={ctaLink}
              btnText={ctaText}
              btnType="fit"
              btnBorder="2px solid #ffffff"
              btnBackground="var(--mad-main)"
              btnColor="var(--mad-white-50)"
              icon="have"
              btnShadow="shadow-[inset_0_3px_8px_rgba(255,255,255,0.45),inset_0_-2px_6px_rgba(0,0,0,0.2)]"
              className="font-bold text-base px-8 py-3 rounded-full hover:scale-[1.02] active:scale-95 transition-all"
            />
          </motion.div>
        </motion.div>

        {/* Desktop Side Image */}
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex items-start justify-center lg:justify-end"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full flex items-start justify-center lg:justify-end"
          >
            <Image
              src={sideImageSrc}
              alt={sideImageAlt}
              width={821}
              height={648}
              style={{ width: "100%", height: "auto" }}
              className="max-h-95 md:max-h-none max-w-[620px] xl:max-w-[750px] object-contain drop-shadow-2xl"
              loading="eager"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
