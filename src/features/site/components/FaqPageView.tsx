"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { FaqHeroBanner } from "./FaqHeroBanner";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { FaqItem } from "../types";

interface FaqCardProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FaqCard: React.FC<FaqCardProps> = ({ item, isOpen, onToggle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 5) * 0.05, ease: "easeOut" }}
      className={`group w-full rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-300 select-none ${
        isOpen
          ? "bg-white border-2 border-purple-600/90 shadow-[0_8px_30px_rgba(109,40,217,0.12)]"
          : "bg-[#fcfaff] border border-purple-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:bg-white hover:border-purple-300 hover:shadow-[0_6px_20px_rgba(109,40,217,0.06)]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 text-right cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm sm:text-base md:text-lg font-bold leading-snug transition-colors duration-200 ${
            isOpen ? "text-purple-900" : "text-gray-800 group-hover:text-purple-700"
          }`}
        >
          {item.question}
        </span>

        <span
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            isOpen
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-purple-100/70 text-purple-600 group-hover:bg-purple-200/80 group-hover:scale-105"
          }`}
        >
          <svg
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M11.9997 13.1714L16.9497 8.22144L18.3637 9.63544L11.9997 15.9994L5.63574 9.63544L7.04974 8.22144L11.9997 13.1714Z" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed pt-4 border-t border-purple-100/60 mt-4">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const FaqPageView: React.FC = () => {
  const { data: faqSection } = usePublicLanding({
    select: (res) => res.data?.faq_section,
  });

  const items: FaqItem[] = faqSection?.items || [];

  // Active open item ID (default first item open if available)
  const [openId, setOpenId] = useState<number | string | null>(() => {
    return items[0]?.id ?? null;
  });

  const toggleItem = (id: number | string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Split into 2 columns (half in right column, half in left column)
  const halfCount = Math.ceil(items.length / 2);
  const rightColumnItems = items.slice(0, halfCount);
  const leftColumnItems = items.slice(halfCount);

  return (
    <div dir="rtl" className="w-full min-h-screen bg-white flex flex-col justify-between relative overflow-hidden">
      <FaqHeroBanner
        title={faqSection?.title || "الأسئلة الشائعة"}
        subtitle={
          faqSection?.subtitle ||
          "كل ما تحتاج معرفته عن المنصة، الاشتراك، وطريقة استخدام خدماتنا."
        }
      />

      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18 relative z-10">
        {items.length === 0 ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-purple-100 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-mad-main flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-mad-text-primary mb-2">
              لا توجد أسئلة شائعة حالياً
            </h2>
            <p className="text-sm text-mad-text-secondary leading-relaxed">
              لم تتم إضافة أي أسئلة شائعة بعد، يرجى مراجعة هذه الصفحة لاحقاً أو التواصل معنا عبر صفحة الاتصال.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-25 items-start">
            {/* Right Column (Column 1 in RTL) */}
            <div className="flex flex-col gap-4 sm:gap-4.5 w-full">
              {rightColumnItems.map((item, idx) => (
                <FaqCard
                  key={`faq-r-${item.id}-${idx}`}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggleItem(item.id)}
                  index={idx}
                />
              ))}
            </div>

            {/* Left Column (Column 2 in RTL) */}
            <div className="flex flex-col gap-4 sm:gap-4.5 w-full">
              {leftColumnItems.map((item, idx) => (
                <FaqCard
                  key={`faq-l-${item.id}-${idx}`}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggleItem(item.id)}
                  index={idx + halfCount}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FaqPageView;
