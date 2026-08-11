"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { InstantReportFeature, InstantReportProps } from "../types";

// ==========================================
// Mock Data  (replace with API data later)
// ==========================================
const DEFAULT_FEATURES: InstantReportFeature[] = [
  {
    id: "instant-report",
    text: "تقرير فوري بعد كل تجربة قراءة",
    icon: "/assets/report.svg",
  },
  {
    id: "clear-grades",
    text: "عرض درجات الطالب بشكل واضح ومنظم",
    icon: "/assets/checkedbook.svg",
  },
  {
    id: "parent-tracking",
    text: "متابعة نتائج الطالب من خلال حساب ولي الأمر",
    icon: "/assets/parent.svg",
  },
  {
    id: "school-reports",
    text: "تقارير دورية للمدارس تساعد في متابعة أداء الطلاب",
    icon: "/assets/school.svg",
  },
];

// ==========================================
// Sub-components
// ==========================================
const FeatureRow = ({ feature }: { feature: InstantReportFeature }) => (
  <li className="flex items-center gap-4">
    {/* Icon */}
    {feature.icon && (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mad-main/10">
        <Image
          src={feature.icon}
          alt=""
          aria-hidden="true"
          width={22}
          height={22}
          className="object-contain"
        />
      </div>
    )}
    <span className="mad-h6 font-semibold text-mad-text-primary">{feature.text}</span>
  </li>
);

// ==========================================
// Main Component
// ==========================================
const InstantReport = ({
  title = "تقرير فوري بعد كل تجربة قراءة",
  description = `تعتمد "مدارك القراءة" على منهجية تربوية مصممة لقياس تقدم الطالب في القراءة، وتعرض النتائج في تقرير واضح يساعد ولي الأمر والمدرسة على متابعة الأداء.`,
  features = DEFAULT_FEATURES,
  ctaLabel = "ابدأ تجربتك المجانية الآن",
  ctaHref,
  onCtaClick,
  image = "/iamges/reportSecimg.png",
  imageAlt = "لوحة تحكم تقارير مدارك القراءة",
}: InstantReportProps) => {
  const handleCta = () => {
    if (ctaHref) window.open(ctaHref, "_blank", "noopener,noreferrer");
    else onCtaClick?.();
  };

  return (
    <section
      dir="rtl"
      className="w-full bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ==================== Image (right / start side in RTL) ==================== */}
          <div className="order-1 flex w-full items-center justify-center">
            <div className="relative w-full max-w-lg">
              <Image
                src={image}
                alt={imageAlt}
                width={700}
                height={520}
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                style={{ width: "100%", height: "auto" }}
                className="object-contain"
              />
            </div>
          </div>

          {/* ==================== Content (left / end side in RTL) ==================== */}
          <div className="order-2 flex flex-col items-start text-right">
            {/* Title */}
            <h2 className="mad-title-2 font-bold" style={{ color: "#0B1120" }}>
              {title}
            </h2>

            {/* Description */}
            <p className="mad-h6 mt-4 max-w-xl leading-7" style={{ color: "#64748B" }}>
              {description}
            </p>

            {/* Feature list */}
            <ul dir="rtl" className="mt-8 flex flex-col gap-5">
              {features.map((f) => (
                <FeatureRow key={f.id} feature={f} />
              ))}
            </ul>

            {/* CTA — solid primary, always */}
            <button
              onClick={handleCta}
              className="mt-10 flex items-center gap-2 rounded-full bg-mad-main px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-mad-main/90 active:scale-95"
            >
              {ctaLabel}
              <ArrowLeft className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstantReport;
export { DEFAULT_FEATURES as instantReportDefaultFeatures };
