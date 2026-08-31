"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePublicPackages } from "../hooks/usePublicPackages";
import { usePublicLanding } from "../hooks/usePublicLanding";
import type { PublicPackage } from "../types";

export interface PricingProps {
  id?: string;
  title?: string;
  description?: string;
  packages?: PublicPackage[];
  onCtaClick?: (packageId: string) => void;
}

// ==========================================
// Sub-components
// ==========================================

const PACKAGE_ICONS = [
  "/iamges/family-icon.svg",
  "/iamges/school-icon.svg",
  "/iamges/crown-illustration.svg",
];

const WhatsAppIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12C2 13.818 2.485 15.523 3.332 16.992L2.086 21.543C1.988 21.902 2.316 22.228 2.674 22.127L7.172 20.852C8.618 21.603 10.26 22.022 12 22.022C17.523 22.022 22 17.545 22 12.022C22 6.5 17.523 2 12 2Z"
      fill="#25D366"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.508 14.385C17.211 14.236 15.75 13.518 15.478 13.419C15.205 13.32 15.007 13.271 14.809 13.568C14.611 13.865 14.042 14.534 13.868 14.732C13.695 14.931 13.522 14.955 13.224 14.806C12.927 14.657 11.97 14.344 10.835 13.333C9.952 12.545 9.355 11.572 9.181 11.274C9.008 10.977 9.162 10.816 9.311 10.668C9.444 10.535 9.608 10.321 9.756 10.147C9.905 9.974 9.954 9.85 10.054 9.652C10.153 9.454 10.103 9.281 10.029 9.132C9.955 8.983 9.36 7.521 9.112 6.927C8.871 6.347 8.626 6.427 8.444 6.417C8.271 6.409 8.073 6.407 7.875 6.407C7.677 6.407 7.355 6.481 7.083 6.779C6.411 7.476 6 8.36 6 9.278C6 10.741 7.065 12.154 7.213 12.353C7.362 12.551 9.309 15.553 12.29 16.84C13 17.147 13.553 17.33 13.985 17.466C14.697 17.693 15.345 17.661 15.856 17.584C16.427 17.499 17.614 16.865 17.862 16.171C18.11 15.477 18.11 14.882 18.035 14.758C17.961 14.634 17.763 14.56 17.466 14.411L17.508 14.385Z"
      fill="white"
    />
  </svg>
);

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

const FeatureRow = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-right" dir="rtl">
    <span className="flex-1 text-sm leading-relaxed text-gray-700">{text}</span>
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-mad-main/10">
      <Check className="size-3 text-mad-main" strokeWidth={3} />
    </span>
  </li>
);

/** Single Package Card directly using API fields */
const PackageCard = ({
  pkg,
  index = 0,
  onCtaClick,
}: {
  pkg: PublicPackage;
  index?: number;
  onCtaClick?: (id: string) => void;
}) => {
  const router = useRouter();

  const isWhatsApp =
    pkg.cta_type === "whatsapp" ||
    pkg.audience === "school" ||
    pkg.cta_text?.includes("واتساب");

  const handleCta = () => {
    if (isWhatsApp) {
      const waNumber = pkg.cta_whatsapp_number?.replace(/\D/g, "") || "966500000000";
      window.open(`https://wa.me/${waNumber}`, "_blank", "noopener,noreferrer");
    } else if (onCtaClick) {
      onCtaClick(pkg.id);
    } else {
      router.push("/register");
    }
  };

  const getBillingPeriod = () => {
    if (pkg.duration_label) return pkg.duration_label;
    if (pkg.duration_type === "days") {
      return pkg.duration_value && pkg.duration_value > 1 ? `${pkg.duration_value} يوم` : "يوميًا";
    }
    if (pkg.duration_type === "months") {
      return pkg.duration_value && pkg.duration_value > 1 ? `${pkg.duration_value} أشهر` : "شهريًا";
    }
    if (pkg.duration_type === "years") {
      return pkg.duration_value && pkg.duration_value > 1 ? `${pkg.duration_value} سنوات` : "سنويًا";
    }
    if (pkg.duration_type === "lifetime") return "مدى الحياة";
    return "";
  };

  const iconSrc = pkg.image_url || PACKAGE_ICONS[index % PACKAGE_ICONS.length];

  const featuresList = Array.isArray(pkg.features)
    ? pkg.features
    : typeof pkg.features === "string"
    ? [pkg.features]
    : [];

  const priceNum =
    pkg.price !== null && pkg.price !== undefined ? pkg.price : null;

  const ageCategories =
    pkg.levels && pkg.levels.length > 0
      ? pkg.levels.map((lvl) => lvl.age_category || `${lvl.age_from}-${lvl.age_to}`)
      : pkg.age_categories || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="relative flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Icon or Image */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: 100, height: 70 }}>
          <Image
            src={iconSrc}
            alt={pkg.name}
            fill
            sizes="100px"
            loading="eager"
            className="object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="mt-4 text-center text-xl font-bold text-mad-main">
        {pkg.name}
      </h3>

      {/* Description */}
      {pkg.description && (
        <p className="mt-1 text-center text-sm text-gray-500">
          {pkg.description}
        </p>
      )}

      {/* Age Categories */}
      {ageCategories.length > 0 && (
        <>
          <p className="mt-5 text-center text-xs font-semibold tracking-wide text-mad-main">
            الفئات العمرية
          </p>
          <AgeGroupPills groups={ageCategories} />
        </>
      )}

      {/* Price block */}
      {priceNum !== null ? (
        <div className="mt-5 text-center" dir="rtl">
          <div className="flex items-baseline justify-center gap-2">
            {pkg.discounted_price ? (
              <>
                <span className="text-4xl font-extrabold text-mad-main">
                  {pkg.discounted_price}
                </span>
                <span className="text-sm font-medium line-through text-gray-400">
                  {priceNum}
                </span>
              </>
            ) : (
              <span className="text-4xl font-extrabold text-mad-main">
                {priceNum}
              </span>
            )}
            <span className="text-base font-medium text-gray-500">
              ر.س {getBillingPeriod() ? `/ ${getBillingPeriod()}` : ""}
            </span>
          </div>
        </div>
      ) : null}

      {/* Divider */}
      <hr className="my-5 border-gray-100" />

      {/* Features */}
      {featuresList.length > 0 && (
        <ul className="flex flex-col gap-4 mb-12">
          {featuresList.map((f, idx) => (
            <FeatureRow key={idx} text={f} />
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCta}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-full border border-mad-main text-mad-main hover:bg-mad-main/5 px-6 py-3 text-sm font-bold transition-all cursor-pointer"
      >
        {isWhatsApp && <WhatsAppIcon className="size-5 shrink-0" />}
        {pkg.cta_text || (isWhatsApp ? "اشترك عبر الواتساب" : "اشترك الآن")}
      </motion.button>
    </motion.div>
  );
};

import { useActiveAccount } from "@/hooks/useActiveAccount";

// ==========================================
// Main Component
// ==========================================
const Pricing: React.FC<PricingProps> = ({
  id: propId,
  title: propTitle,
  description: propDescription,
  packages: propPackages,
  onCtaClick,
}) => {
  const { userRole, isStudent, activeAccount } = useActiveAccount();
  const isChildOrStudent =
    isStudent ||
    userRole === "student" ||
    userRole === "child" ||
    activeAccount?.type === "child";

  const { data: packagesData } = usePublicPackages({
    select: (res) => res.data,
  });

  const { data: homePackagesSection } = usePublicLanding({
    select: (res) => res.data?.packages_section,
  });

  if (isChildOrStudent) {
    return null;
  }

  const id = propId ?? packagesData?.id ?? homePackagesSection?.id;
  const title =
    propTitle ??
    packagesData?.title ??
    homePackagesSection?.title ??
    "اختر الباقة المناسبة لطفلك";
  const description =
    propDescription ??
    packagesData?.subtitle ??
    homePackagesSection?.subtitle ??
    "باقات مرنة تناسب جميع المراحل العمرية، لتمنح طفلك تجربة قراءة ممتعة وآمنة.";

  const packagesList = propPackages ?? packagesData?.packages ?? [];

  if (packagesList.length === 0) {
    return null;
  }

  const gridColsClass =
    packagesList.length === 1
      ? "max-w-md grid-cols-1"
      : packagesList.length === 2
      ? "max-w-3xl sm:grid-cols-2"
      : "max-w-5xl sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section dir="rtl" id={id} className="relative w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Anchor targets for #pricing and #packages */}
      <span id="pricing" className="sr-only absolute -top-24 pointer-events-none" />
      <span id="packages" className="sr-only absolute -top-24 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          title={title}
          description={description}
          align="center"
          titleClassName="mad-h2 font-bold text-mad-text-primary"
          descriptionClassName="mad-h6 mt-3 text-mad-text-secondary md:w-full max-w-2xl mx-auto"
        />

        {/* Cards grid */}
        <div className={`mx-auto mt-12 grid gap-6 lg:gap-8 ${gridColsClass}`}>
          {packagesList.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={index}
              onCtaClick={onCtaClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
