"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PackageCard } from "@/features/packages/components/PackageCard";
import { usePackagesList } from "@/features/packages/hooks/usePackages";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { usePublicPackages } from "../hooks/usePublicPackages";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { CheckoutModal } from "@/features/payment";
import { PackagePlan } from "@/features/packages/types";
import type { PublicPackage } from "../types";

export interface PricingProps {
  id?: string;
  title?: string;
  description?: string;
  packages?: PublicPackage[] | PackagePlan[];
  onCtaClick?: (packageId: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({
  id: propId,
  title: propTitle,
  description: propDescription,
  packages: propPackages,
  onCtaClick,
}) => {
  const router = useRouter();
  const { data: fetchedPackages = [], isLoading: isPkgsLoading } = usePackagesList();
  const {
    isAuthenticated,
    isStudent,
    userRole,
    activeAccount,
    isLoading: isAuthLoading,
  } = useActiveAccount();

  const [selectedPackageForCheckout, setSelectedPackageForCheckout] =
    useState<PackagePlan | null>(null);

  const { data: packagesData } = usePublicPackages({
    select: (res) => res.data,
  });

  const { data: homePackagesSection } = usePublicLanding({
    select: (res) => res.data?.packages_section,
  });

  const isChildOrStudent =
    isStudent ||
    userRole === "student" ||
    userRole === "child" ||
    activeAccount?.type === "child";

  if (isChildOrStudent) {
    return null;
  }

  const id = propId ?? packagesData?.id ?? homePackagesSection?.id ?? "pricing";
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

  const packagesList: PackagePlan[] =
    propPackages && propPackages.length > 0
      ? (propPackages as PackagePlan[])
      : fetchedPackages;

  const isLoading = isPkgsLoading || isAuthLoading;

  const handleSelectPackage = (pkg: PackagePlan) => {
    if (onCtaClick) {
      onCtaClick(pkg.id);
      return;
    }

    if (pkg.ctaType === "whatsapp" || pkg.audience === "school") {
      const waUrl = pkg.ctaLink || "https://wa.me/966500000000";
      window.open(waUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (isAuthenticated) {
      setSelectedPackageForCheckout(pkg);
    } else {
      router.push(`/register?package=${pkg.id}`);
    }
  };

  if (!isLoading && packagesList.length === 0) {
    return null;
  }

  const gridColsClass =
    packagesList.length === 1
      ? "max-w-md grid-cols-1"
      : packagesList.length === 2
      ? "max-w-3xl sm:grid-cols-2"
      : "max-w-5xl sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      dir="rtl"
      id={id}
      className="relative w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
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
        {isLoading ? (
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[520px] rounded-[28px] border border-gray-100 bg-gray-50/70 animate-pulse p-8"
              />
            ))}
          </div>
        ) : (
          <div className={`mx-auto mt-12 grid gap-6 lg:gap-8 ${gridColsClass}`}>
            {packagesList.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                index={index}
                onSelect={handleSelectPackage}
              />
            ))}
          </div>
        )}

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={Boolean(selectedPackageForCheckout)}
          pkg={selectedPackageForCheckout}
          onClose={() => setSelectedPackageForCheckout(null)}
        />
      </div>
    </section>
  );
};

export default Pricing;
