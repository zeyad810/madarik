"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { FaqItem, FqaProps } from "../types";

const Fqa: React.FC<FqaProps> = ({
  subtitle: propSubtitle,
  title: propTitle,
  items: propItems,
  imageSrc = "/assets/person-ques.png",
  imageAlt = "شخص يفكر وحوله علامات استفهام",
}) => {
  const { data: faqData } = usePublicLanding({
    select: (res) => res.data?.faq_section,
  });

  const title = propTitle ?? faqData?.title ?? "";
  const subtitle = propSubtitle ?? faqData?.subtitle ?? "";
  const items: FaqItem[] = propItems ?? (faqData?.items ?? []);

  const [openId, setOpenId] = useState<number | string | null>(null);

  // If no item is explicitly toggled, default to opening the first item
  const activeOpenId = openId ?? items[0]?.id ?? null;

  const toggleItem = (id: number | string) => {
    setOpenId((prev) => (prev === id ? -1 : id));
  };

  return (
    <section dir="rtl" className="relative w-full bg-linear-to-b from-[#fbfaff] via-white to-white section-spacing px-4 md:px-8 overflow-hidden">
      {/* Background Ambient Glows for Glassmorphism Effect */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto flex flex-col items-center relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mb-12 md:mb-16"
        >
          {subtitle && (
            <span className="mad-label-1 font-bold text-mad-main-light block mb-2">
              {subtitle}
            </span>
          )}
          <h2 className="mad-h2 font-extrabold text-mad-text-primary">
            {title}
          </h2>
        </motion.div>

        {/* Content Layout Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Illustration Image Column (Right in RTL layout) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center items-center order-2 lg:order-1"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[291px] h-[291px] lg:w-[596px] lg:h-[596px] aspect-square shrink-0"
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={596}
                height={596}
                className="w-full h-full object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Accordion List Column (Left in RTL layout) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4 order-1 lg:order-2">
            <div className="w-full flex flex-col gap-4">
              {items.map((item, index) => {
                const isOpen = activeOpenId === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                    whileHover={{ y: -2 }}
                    className={`group w-full rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all duration-300 cursor-pointer select-none ${
                      isOpen
                        ? "bg-white/80 backdrop-blur-md border-t-4 border-t-mad-main border-y border-l border-white/90 shadow-[0_12px_32px_rgba(109,40,217,0.08)]"
                        : "bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:bg-white/85 hover:border-purple-200/80 hover:shadow-[0_10px_30px_rgba(109,40,217,0.08)]"
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {/* Question Header Row */}
                    <div className="flex items-center justify-between gap-4 w-full">
                      <h3
                        className={`mad-body-1 md:mad-h6 font-bold text-right transition-colors duration-200 ${
                          isOpen
                            ? "text-mad-main"
                            : "text-mad-text-primary group-hover:text-mad-main-light"
                        }`}
                      >
                        {item.question}
                      </h3>
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-mad-main text-white shadow-md"
                            : "bg-[#f4f0ff]/80 backdrop-blur-xs text-mad-main-light group-hover:bg-purple-100 group-hover:scale-105"
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 fill-current transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 24 24"
                        >
                          {isOpen ? (
                            <path d="M19 13H5v-2h14v2z" />
                          ) : (
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                          )}
                        </svg>
                      </span>
                    </div>

                    {/* Smooth Collapsible Answer Panel with AnimatePresence */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="mad-body-2 text-mad-text-secondary leading-relaxed text-right pt-3.5">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex justify-start mt-6"
            >
              <button
                type="button"
                className="px-9 py-3.5 bg-mad-main hover:bg-purple-700 text-white mad-body-2 font-bold rounded-full shadow-[0_12px_30px_rgba(109,40,217,0.35)] hover:shadow-[0_18px_40px_rgba(109,40,217,0.45)] transition-all duration-300 cursor-pointer backdrop-blur-xs"
              >
                عرض المزيد
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Fqa;