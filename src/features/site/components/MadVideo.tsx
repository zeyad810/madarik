"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowLeft } from "lucide-react";
import { usePublicLanding } from "../hooks/usePublicLanding";
import type { MadVideoProps } from "../types";

const MadVideo: React.FC<MadVideoProps> = ({
  id: propId,
  subtitle: propSubtitle,
  title: propTitle,
  description: propDescription,
  ctaText = "ابدأ تجربتك المجانية الآن",
  ctaHref = "#",
  youtubeId = "dQw4w9WgXcQ", // Replace with target Youtube video ID
  thumbnailSrc = "/iamges/video_thumbnail.png",
  onCtaClick,
}) => {
  const { data: tourData } = usePublicLanding({
    select: (res) => res.data?.platform_tour_section,
  });

  const id = propId ?? tourData?.id;
  const title = propTitle ?? tourData?.title ?? "";
  const subtitle = propSubtitle ?? tourData?.eyebrow ?? "";
  const description = propDescription ?? tourData?.description ?? "";

  const [isOpen, setIsOpen] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <section
      dir="rtl"
      id={id}
      className="relative w-full overflow-hidden bg-mad-white-50 section-spacing px-4 md:px-8"
    >
      <div className="container relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ==================== CONTENT & CTA COLUMN ==================== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-right"
          >
            {/* Subtitle / Eyebrow */}
            {subtitle && (
              <span className="mad-label-1 font-bold text-mad-purple-600 mb-2 block">
                {subtitle}
              </span>
            )}

            {/* Main Heading */}
            <h2 className="mad-h3 font-extrabold text-mad-text-primary tracking-tight">
              {title}
            </h2>

            {/* Description */}
            <p className="mt-4 mad-body-2 text-mad-text-secondary leading-relaxed max-w-xl">
              {description}
            </p>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8"
            >
              <a
                href={ctaHref}
                onClick={onCtaClick}
                className="bg-mad-purple-600 hover:bg-mad-purple-700 text-mad-white-50 font-bold mad-label-1 px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2.5 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
              >
                <span>{ctaText}</span>
                <ArrowLeft className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* ==================== VIDEO THUMBNAIL / EMBED PLAYER ==================== */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-6 relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(true)}
              className="relative w-full aspect-video rounded-3xl sm:rounded-4xl overflow-hidden shadow-lg cursor-pointer group bg-mad-white-200"
            >
              {/* Thumbnail Image */}
              <Image
                src={thumbnailSrc}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-300" />

              {/* Glowing Play Button Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  aria-label="تشغيل الفيديو"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-mad-purple-100/90 text-mad-purple-600 flex items-center justify-center shadow-xl backdrop-blur-xs border border-mad-purple-200 cursor-pointer"
                >
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ==================== YOUTUBE EMBED MODAL ==================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق الفيديو"
                className="absolute -top-12 left-0 sm:top-4 sm:left-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* YouTube Embed Iframe */}
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MadVideo;