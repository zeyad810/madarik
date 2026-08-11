"use client";

import React from "react";

import { StepItem, HowItWorksProps } from "../types";


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
    <div className="relative flex items-center w-full min-h-[140px] sm:min-h-[165px] md:min-h-[175px]">
      {/* Capsule Frame Container composed of Two Divs */}
      <div className="relative flex-1 flex items-stretch min-h-[110px] sm:min-h-[140px] md:min-h-[160px]">
        {/* Right Div: Smaller segment under Circle Badge with Top & Bottom Border */}
        <div
          className="relative w-25 sm:w-[140px] md:w-[160px] flex-shrink-0 border-y-[3px] border-solid bg-white transition-colors duration-300"
          style={{ borderColor: step.color }}
        />

        {/* Left Div: Main body holding Description Text, rounded on left, with dots at start */}
        <div
          className="relative flex-1 flex items-center border-y-[3px] border-l-[3px] border-r-0 border-solid bg-white rounded-l-[50px] sm:rounded-l-[80px] md:rounded-l-[90px] pl-5 sm:pl-8 md:pl-10 pr-4 sm:pr-6 py-3 sm:py-4 transition-colors duration-300"
          style={{ borderColor: step.color }}
        >
          {/* Top Border Gap & Dot at start (right edge) of Left Div */}
          <div className="absolute -top-1.25 right-4 sm:right-2 lg:right-1 translate-x-1/2 bg-white ps-1.5 flex items-center justify-center z-10 -translate-y-0.5">
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
              style={{ backgroundColor: step.color }}
            />
          </div>

          {/* Bottom Border Gap & Dot at start (right edge) of Left Div */}
          <div className="absolute -bottom-1.25 right-4 sm:right-2 lg:right-1 translate-x-1/2 bg-white ps-1.5 flex items-center justify-center z-10 translate-y-0.5">
            <span
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
              style={{ backgroundColor: step.color }}
            />
          </div>

          {/* Description Text */}
          <p className="mad-body-4 sm:mad-body-2 md:mad-h6 text-mad-text-secondary font-medium text-right select-none">
            {step.description}
          </p>
        </div>
      </div>

      {/* Right Circle Badge Overlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-20 bg-white ">
        {/* Crescent Shape Element */}
        <div
          className="absolute -top-2.5 -right-2.5 w-[132px] h-[132px] sm:w-[164px] sm:h-[164px] md:w-[180px] md:h-[180px] pointer-events-none z-0"
          style={{
            borderRadius: "100%",
            // @ts-expect-error - CSS draft corner-shape property
            cornerShape: "scoop round round scoop",
            color: step.color,
            background: step.color,
            transform: "translate(10px, -5px) rotate(-33deg)",
          }}
        />

        {/* White Main Circle */}
        <div className="relative z-10 w-[112px] h-[112px] sm:w-[144px] sm:h-[144px] md:w-[160px] md:h-[160px] rounded-full bg-white flex flex-col items-center justify-center text-center p-2.5 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100">
          <span className="mad-h3 font-extrabold text-mad-text-primary mb-0.5 sm:mb-1 md:mb-1.5 font-sans">
            {step.number}
          </span>
          <span className="mad-label-1 font-bold text-mad-text-primary max-w-[95px] sm:max-w-[110px]">
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
    <section dir="rtl" className="w-full bg-white section-spacing px-4 sm:px-6 md:px-8">
      <div className="container mx-auto flex flex-col items-center">

        {/* Header Section */}
        <div className="text-center max-w-3xl px-4">
          <h2 className="mad-h2 font-extrabold text-mad-text-primary mb-3 md:mb-4">
            {title}
          </h2>
          <p className="mad-body-2 text-mad-text-secondary font-medium">
            {subtitle}
          </p>
        </div>


        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 py-6 md:py-8">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
