"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaqHeroBanner } from "./FaqHeroBanner";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { FaqItem } from "../types";

// Default comprehensive FAQ list matching the 10 questions in design
const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "ما الفئة العمرية المناسبة للمنصة؟",
    answer:
      "منصة مدارك مصممة خصيصاً للأطفال من سن ٤ إلى ١٣ سنة، تضم المنصة محتوى متدرجاً يناسب مختلف المراحل، من المرحلة التأسيسية للأطفال الصغار حتى مرحلة الاستقلالية في القراءة لكبارهم.",
  },
  {
    id: 2,
    question: "كيف يمكنني الاشتراك في المنصة؟",
    answer:
      "يمكنك الاشتراك بسهولة عبر إنشاء حساب جديد، ثم اختيار الباقة المناسبة لك ولأطفالك من صفحة الباقات وإتمام عملية الدفع بأمان وسهولة.",
  },
  {
    id: 3,
    question: "هل المحتوى آمن لطفلي؟",
    answer:
      "نعم، جميع القصص والمحتوى المعروض على المنصة مراجع ومدقق تربوياً وثقافياً لضمان بيئة تعليمية آمنة وهادفة ومناسبة تماماً لأعمار الأطفال.",
  },
  {
    id: 4,
    question: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
    answer:
      "نعم، يمكنك إلغاء الاشتراك في أي وقت بكل سهولة من خلال لوحة تحكم ولي الأمر دون أي التزامات طويلة الأمد أو رسوم خفية.",
  },
  {
    id: 5,
    question: "ما الفرق بين الباقات المتاحة؟",
    answer:
      "تختلف الباقات في عدد ملفات الأطفال المسموح بإضافتها، والوصول إلى كافة مستويات القصص، بالإضافة إلى الاختبارات التفاعلية والتقارير المتقدمة للتقدم القرائي.",
  },
  {
    id: 6,
    question: "كيف يمكنني الاشتراك في المنصة؟",
    answer:
      "يمكنك البدء بإنشاء حساب ولي أمر مجاني، وتجربة القصص التأسيسية المتاحة، ثم الترقية للباقات المدفوعة للحصول على وصول كامل لجميع القصص والاختبارات.",
  },
  {
    id: 7,
    question: "كيف يمكنني الاشتراك في المنصة؟",
    answer:
      "يتيح لك الاشتراك الوصول الفوري لجميع القصص التفاعلية، وتخصيص تجربة قراءة ممتعة لكل طفل مع تسجيل النقاط ومتابعة التقدم أولاً بأول.",
  },
  {
    id: 8,
    question: "هل المحتوى آمن لطفلي؟",
    answer:
      "نحن نولي أمان الأطفال الأولوية القصوى، حيث تخلو منصتنا تماماً من الإعلانات الخارجية، وجميع التفاعلات مراقبة وموجهة للتعليم والترفيه الهادف.",
  },
  {
    id: 9,
    question: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
    answer:
      "بالتأكيد، لديك كامل الحرية في إدارة عضويتك وإيقاف التجديد التلقائي وقتما تشاء بخطوة واحدة من صفحة إعدادات الحساب.",
  },
  {
    id: 10,
    question: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
    answer:
      "عملية الإلغاء فورية ومرنة، وسيظل بإمكان طفلك الاستمتاع بكافة مزايا الباقة حتى نهاية الفترة المدفوعة الحالية دون انقطاع.",
  },
];

interface FaqCardProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FaqCard: React.FC<FaqCardProps> = ({ item, isOpen, onToggle, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className={`group w-full rounded-2xl p-5 md:p-6 transition-all duration-300 select-none cursor-pointer border ${
        isOpen
          ? "bg-[#FAF9FF] border-purple-200/90 shadow-[0_10px_25px_rgba(109,40,217,0.06)]"
          : "bg-white border-[#F1EFFB] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-purple-200/70 hover:shadow-[0_6px_20px_rgba(109,40,217,0.05)]"
      }`}
      onClick={onToggle}
    >
      {/* Header Row: In RTL Question is on the Right, Toggle Button on the Left */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Toggle Button (Left in RTL) */}
        <span
          className={`size-8 md:size-8.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            isOpen
              ? "bg-[#6D28D9] text-white shadow-md shadow-purple-600/20"
              : "bg-[#F3EFFF] text-[#6D28D9] group-hover:bg-[#EAE4FF] group-hover:scale-105"
          }`}
          aria-label={isOpen ? "إغلاق السؤال" : "فتح السؤال"}
        >
          {isOpen ? (
            <svg
              className="size-4 stroke-current stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
            </svg>
          ) : (
            <svg
              className="size-4 stroke-current stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
          )}
        </span>

        {/* Question Text (Right in RTL) */}
        <h3
          className={`font-bold text-sm sm:text-base leading-snug text-right flex-1 transition-colors duration-200 ${
            isOpen
              ? "text-[#1E1B4B]"
              : "text-[#1E1B4B] group-hover:text-[#6D28D9]"
          }`}
        >
          {item.question}
        </h3>
      </div>

      {/* Expandable Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed text-right pt-3 md:pt-3.5 border-t border-purple-100/60 mt-3.5">
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

  // Combine backend API items with our default items
  const items: FaqItem[] = React.useMemo(() => {
    const apiItems = faqSection?.items || [];
    if (apiItems.length >= 10) {
      return apiItems;
    }
    if (apiItems.length > 0) {
      // Merge unique items from API with defaults
      const existingIds = new Set<string | number>(apiItems.map((it) => it.id));
      const filteredDefaults = DEFAULT_FAQ_ITEMS.filter(
        (def) => !existingIds.has(def.id)
      );
      return [...apiItems, ...filteredDefaults].slice(0, 10);
    }
    return DEFAULT_FAQ_ITEMS;
  }, [faqSection?.items]);

  // Active open item ID (default first item open to match screenshot design)
  const [openId, setOpenId] = useState<number | string | null>(() => {
    return items[0]?.id ?? 1;
  });

  const toggleItem = (id: number | string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Split into 2 columns (5 in right column, 5 in left column)
  const halfCount = Math.ceil(items.length / 2);
  const rightColumnItems = items.slice(0, halfCount);
  const leftColumnItems = items.slice(halfCount);

  return (
    <div dir="rtl" className="w-full min-h-screen bg-white flex flex-col justify-between relative overflow-hidden">
      {/* 1. Top Hero Banner */}
      <FaqHeroBanner
        title={faqSection?.title || "الأسئلة الشائعة"}
        subtitle={
          faqSection?.subtitle ||
          "كل ما تحتاج معرفته عن المنصة، الاشتراك، وطريقة استخدام خدماتنا."
        }
      />

      {/* 2. Main FAQ Content Grid */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18 relative z-10">
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
      </main>
    </div>
  );
};

export default FaqPageView;
