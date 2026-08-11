"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { PricingPlan, PricingProps } from "../types";

// ==========================================
// Mock Data  (replace with API data later)
// ==========================================
const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: "family",
    name: "الباقة العائلية",
    description: "الباقة المثالية للعائلات التي تضم أكثر من طفل",
    icon: "/iamges/family-icon.svg",
    ageGroups: ["5-9", "10-12", "13-15"],
    price: 149,
    currency: "ر.س",
    billingPeriod: "شهريًا",
    badge: "لمدة سنة كاملة شاملة",
    ctaLabel: "اشترك الآن",
    featured: true,
    features: [
      "كل مميزات الباقة المقدمة",
      "تفعيل حتى 5 حسابات للأطفال",
      "تقارير نمو دورية وشهرية للوالدين",
      "دعم أولوية 24/7 واستشارات تربوية",
    ],
  },
  {
    id: "schools",
    name: "باقة المدارس",
    description: "حل متكامل للمدارس والمعلمين",
    icon: "/iamges/school-icon.svg",
    ageGroups: ["5-9", "10-12", "13-15"],
    price: null,
    ctaLabel: "اشترك عبر الواتساب",
    ctaHref: "https://wa.me/966500000000",
    featured: false,
    features: [
      "إنشاء فصول دراسية وإدارة الطلاب",
      "متابعة أداء الطلاب وإصدار التقارير",
      "مكتبة قصصي وأنشطة تعليمية",
      "اختبارات تكيفية",
    ],
  },
];

// ==========================================
// Sub-components
// ==========================================

/** Static age-group pills — display only, not interactive */
const AgeGroupPills = ({ groups }: { groups: string[] }) => (
  <div className="mt-3 flex flex-wrap justify-center gap-2">
    {groups.map((g) => (
      <span
        key={g}
        className="rounded-full bg-mad-main/10 px-3 py-1 text-sm font-medium text-mad-main"
      >
        {g}
      </span>
    ))}
  </div>
);

/** Single feature bullet row — checkmark matches age-group pill colour */
const FeatureRow = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-right" dir="rtl">
    <span className="flex-1 text-sm leading-relaxed text-gray-700">{text}</span>
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-mad-main/10">
      <Check className="size-3 text-mad-main" strokeWidth={3} />
    </span>
  </li>
);

/** Pricing plan card */
const PlanCard = ({
  plan,
  onCtaClick,
}: {
  plan: PricingPlan;
  onCtaClick?: (id: string) => void;
}) => {
  const handleCta = () => {
    if (plan.ctaHref) {
      window.open(plan.ctaHref, "_blank", "noopener,noreferrer");
    } else {
      onCtaClick?.(plan.id);
    }
  };

  return (
    <div className="relative flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: 100, height: 70 }}>
          <Image
            src={plan.icon}
            alt={plan.name}
            fill
            className="object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Name + description */}
      <h3 className="mt-4 text-center text-xl font-bold text-mad-main">
        {plan.name}
      </h3>
      {plan.description && (
        <p className="mt-1 text-center text-sm text-gray-500">
          {plan.description}
        </p>
      )}

      {/* Age group label + pills */}
      <p className="mt-5 text-center text-xs font-semibold tracking-wide text-mad-main">
        الفئات العمرية
      </p>
      <AgeGroupPills groups={plan.ageGroups} />

      {/* Price block — above the divider */}
      {plan.price !== null ? (
        <div className="mt-5 text-center" dir="rtl">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-mad-main">
              {plan.price}
            </span>
            <span className="text-base font-medium text-gray-500">
              {plan.currency ?? "ريال"} / {plan.billingPeriod ?? "شهريًا"}
            </span>
          </div>
          {plan.badge && (
            <p className="mt-1 text-xs font-medium text-mad-main underline underline-offset-2">
              {plan.badge}
            </p>
          )}
        </div>
      ) : null}

      {/* Divider */}
      <hr className="my-5 border-gray-100" />

      {/* Features */}
      <ul className="flex flex-col gap-4">
        {plan.features.map((f) => (
          <FeatureRow key={f} text={f} />
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={handleCta}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-mad-main px-6 py-3 text-sm font-bold text-mad-main transition-all hover:bg-mad-main/5 active:scale-95"
      >
        {/* WhatsApp icon for schools plan */}
        {plan.id === "schools" && (
          <svg
            viewBox="0 0 24 24"
            className="size-4 fill-current"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
        {plan.ctaLabel}
      </button>
    </div>
  );
};

// ==========================================
// Main Component
// ==========================================
const Pricing = ({
  title = "اختر الباقة المناسبة لطفلك",
  description = "باقات مرنة تناسب جميع المراحل العمرية، لتمنح طفلك تجربة قراءة ممتعة وآمنة.",
  plans = DEFAULT_PLANS,
  onCtaClick,
}: PricingProps) => {
  return (
    <section dir="rtl" className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mad-title-2 font-bold text-mad-main">{title}</h2>
          {description && (
            <p className="mad-h6 mt-3 text-mad-main/60">{description}</p>
          )}
        </div>

        {/* Cards grid */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2 lg:gap-8">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onCtaClick={onCtaClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
export { DEFAULT_PLANS as pricingDefaultPlans };
