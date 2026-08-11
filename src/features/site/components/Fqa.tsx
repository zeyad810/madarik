"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaqItem, FqaProps } from "../types";

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "ما الفئة العمرية المناسبة للمنصة؟",
    answer:
      "منصة مدارك مصممة خصيصاً للأطفال من سن ٤ إلى ١٢ سنة. تضم المنصة محتوى متدرجاً يناسب مختلف المراحل، من المرحلة التأسيسية للأطفال الصغار حتى مرحلة الاستقلالية في القراءة لكبارهم.",
  },
  {
    id: 2,
    question: "كيف يمكنني الاشتراك في المنصة؟",
    answer:
      "يمكنك الاشتراك بسهولة عبر إنشاء حساب ولي أمر أو مدرسة، ثم اختيار الباقة التنافسية المناسبة والبدء في استخدام المنصة فوراً.",
  },
  {
    id: 3,
    question: "هل المحتوى آمن لطفلي؟",
    answer:
      "نعم، جميع قصص ومحتويات المنصة آمنة تماماً وخالية من أي إعلانات، وتراعي القيم التربوية والتطويرية للطفل.",
  },
  {
    id: 4,
    question: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
    answer:
      "نعم، يمكنك إلغاء الاشتراك أو تجميده في أي وقت مباشرة من خلال لوحة تحكم حسابك بسهولة ودون أي تعقيدات.",
  },
  {
    id: 5,
    question: "ما الفرق بين الباقات المتاحة؟",
    answer:
      "تختلف الباقات بناءً على عدد حسابات الأطفال وتفاصيل التقارير الذكية والمميزات المخصصة للمدارس والمؤسسات.",
  },
];

const Fqa: React.FC<FqaProps> = ({
  subtitle = "لديك أسئلة؟ نحن هنا للإجابة",
  title = "الأسئلة الشائعة",
  items = DEFAULT_FAQ_ITEMS,
  imageSrc = "/assets/person-ques.png",
  imageAlt = "شخص يفكر وحوله علامات استفهام",
}) => {
  const [openId, setOpenId] = useState<number | string | null>(items[0]?.id ?? 1);

  const toggleItem = (id: number | string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section dir="rtl" className="w-full bg-white section-spacing px-4 md:px-8 overflow-hidden">
      <div className="container mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mb-12 md:mb-16">
          <span className="mad-label-1 font-bold text-mad-main-light block mb-2">
            {subtitle}
          </span>
          <h2 className="mad-h2 font-extrabold text-mad-text-primary">
            {title}
          </h2>
        </div>

        {/* Content Layout Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Illustration Image Column (Right in RTL layout) */}
          <div className="lg:col-span-5 flex justify-center items-center order-2 lg:order-1">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[460px]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={500}
                height={500}
                className="w-full h-auto object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>

          {/* Accordion List Column (Left in RTL layout) */}
          <div className="lg:col-span-7 flex flex-col items-center gap-4 order-1 lg:order-2">
            <div className="w-full flex flex-col gap-4">
              {items.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`group w-full rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all duration-300 cursor-pointer select-none ${
                      isOpen
                        ? "bg-linear-to-r from-[#f4f0ff] via-[#f7f4ff] to-white border-r-4 border-r-mad-main border-y border-l border-[#e4dafc] shadow-[0_10px_30px_rgba(109,40,217,0.07)]"
                        : "bg-white border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-purple-200 hover:shadow-[0_8px_25px_rgba(109,40,217,0.06)] hover:-translate-y-0.5"
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
                            : "bg-[#f4f0ff] text-mad-main-light group-hover:bg-purple-100 group-hover:scale-105"
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

                    {/* Smooth Collapsible Answer Panel */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-3.5"
                          : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="mad-body-2 text-mad-text-secondary leading-relaxed text-right pt-0.5">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View More Button */}
            <div className="mt-6">
              <button
                type="button"
                className="px-8 py-3 bg-mad-main hover:bg-purple-700 text-white mad-body-2 font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                عرض المزيد
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Fqa;