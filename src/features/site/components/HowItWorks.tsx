"use client";

import React from "react";

export interface StepItem {
  id: string | number;
  number: string;
  title: string;
  description: string;
  color: string;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
}

const DEFAULT_STEPS: StepItem[] = [
  {
    id: 1,
    number: "01",
    title: "أنشئ حسابك",
    description:
      "سجل حساب ولي الأمر أو المدرسة، ثم أضف حسابات الأطفال أو الطلاب بسهولة.",
    color: "var(--mad-main)", // Purple / Main
  },
  {
    id: 2,
    number: "02",
    title: "اختر المستوى المناسب",
    description:
      "حدد الفئة العمرية أو مستوى القراءة ليحصل الطفل على محتوى يناسب قدراته.",
    color: "var(--mad-third)", // Yellow / Amber
  },
  {
    id: 3,
    number: "03",
    title: "ابدأ رحلة التعلم",
    description:
      "استمتع بالقصص التفاعلية والأنشطة التعليمية التي تنمي مهارات القراءة بطريقة ممتعة.",
    color: "var(--mad-secondary)", // Teal / Secondary
  },
  {
    id: 4,
    number: "04",
    title: "تابع التقدم",
    description:
      "اطّلع على تقارير الأداء والإنجازات، وراقب تطور مهارات الطفل أولاً بأول.",
    color: "var(--mad-pink)", // Pink / Accent
  },
];

const StepCard: React.FC<{ step: StepItem }> = ({ step }) => {
  return (
    <div className="relative flex items-center w-full min-h-[155px] sm:min-h-[165px] md:min-h-[175px] group transition-all duration-300 hover:-translate-y-1">
      {/* Capsule Frame Body */}
      <div
        className="relative flex-1 flex items-center min-h-[140px] sm:min-h-[150px] md:min-h-[160px] rounded-l-[80px] sm:rounded-l-[90px] border-[3px] border-solid border-r-0 bg-white pr-36 sm:pr-40 md:pr-48 pl-6 sm:pl-8 md:pl-10 py-4 transition-colors duration-300"
        style={{ borderColor: step.color }}
      >
        {/* Top Border Gap & Dot */}
        <div className="absolute -top-[5px] right-[32%] sm:right-[38%] bg-white px-2 flex items-center justify-center z-10">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-transform duration-300 group-hover:scale-125"
            style={{ backgroundColor: step.color }}
          />
        </div>

        {/* Bottom Border Gap & Dot */}
        <div className="absolute -bottom-[5px] right-[32%] sm:right-[38%] bg-white px-2 flex items-center justify-center z-10">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-transform duration-300 group-hover:scale-125"
            style={{ backgroundColor: step.color }}
          />
        </div>

        {/* Description Text */}
        <p className="mad-body-2 text-mad-text-secondary font-medium text-right select-none">
          {step.description}
        </p>
      </div>

      {/* Right Circle Badge Overlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-20 bg-white">
        {/* Crescent Ring Arc around circle */}
        <svg
          className="absolute -top-2.5 -right-2.5 w-42 h-42 sm:w-44 sm:h-44 md:w-46 md:h-46 pointer-events-none z-0 transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 180 180"
          fill="none"
          style={{ color: step.color }}
        >
          <path
            d="M 32 46 A 74 74 0 1 1 168 124"
            stroke="currentColor"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
        </svg>

        {/* White Main Circle */}
        <div className="relative z-10 w-[132px] h-[132px] sm:w-[146px] sm:h-[146px] md:w-[160px] md:h-[160px] rounded-full bg-white flex flex-col items-center justify-center text-center p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 transition-transform duration-300 group-hover:scale-[1.02]">
          <span className="mad-h3 font-extrabold text-mad-text-primary mb-1 md:mb-1.5 font-sans">
            {step.number}
          </span>
          <span className="mad-label-1 font-bold text-mad-text-primary max-w-[110px]">
            {step.title}
          </span>
        </div>
      </div>
    </div>
  );
};

const HowItWorks: React.FC<HowItWorksProps> = ({
  title = "كيف تعمل المنصة؟",
  subtitle = "ابدأ رحلة طفلك التعليمية في ثلاث خطوات بسيطة، واستمتع بتجربة تعلم تفاعلية وآمنة.",
  steps = DEFAULT_STEPS,
}) => {
  return (
    <section dir="rtl" className="w-full bg-white py-8 px-4 md:px-8">
      <div className="container mx-auto flex flex-col items-center">
        {/* Top Horizontal Dotted Border Line */}
        <div className="w-full border-t-2 border-dotted border-sky-300/80 mb-8 md:mb-10" />

        {/* Header Section */}
        <div className="text-center max-w-3xl px-4">
          <h2 className="mad-h2 font-extrabold text-mad-text-primary mb-3 md:mb-4">
            {title}
          </h2>
          <p className="mad-body-2 text-mad-text-secondary font-medium">
            {subtitle}
          </p>
        </div>

        {/* Bottom Header Dotted Border Line */}
        <div className="w-full border-t-2 border-dotted border-sky-300/80 mt-8 md:mt-10 mb-12 md:mb-16" />

        {/* 2x2 Steps Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>

        {/* Bottom Section Dotted Border Line */}
        <div className="w-full border-t-2 border-dotted border-sky-300/80 mt-16 md:mt-20" />
      </div>
    </section>
  );
};

export default HowItWorks;
