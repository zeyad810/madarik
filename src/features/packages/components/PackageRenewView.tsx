"use client";

import React, { useState } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PackageCard } from "./PackageCard";
import { CurrentSubscriptionBanner } from "./CurrentSubscriptionBanner";
import { useCurrentSubscription, usePackagesList } from "../hooks/usePackages";
import { CheckoutModal } from "@/features/payment";
import { PackagePlan } from "../types";

export const PackageRenewView: React.FC = () => {
  const { data: subscription, isLoading: isSubLoading } = useCurrentSubscription();
  const { data: packages = [], isLoading: isPkgLoading } = usePackagesList();
  const [selectedPackageForCheckout, setSelectedPackageForCheckout] = useState<PackagePlan | null>(null);

  const handleSelectPackage = (pkg: PackagePlan) => {
    if (pkg.ctaType === "whatsapp" || pkg.audience === "school") {
      const waUrl = pkg.ctaLink || "https://wa.me/966500000000";
      window.open(waUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedPackageForCheckout(pkg);
  };

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-start mb-6">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" className="text-mad-main font-bold hover:underline">
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-gray-500 font-medium">
                  تجديد الاشتراك
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* =========================================================================
            2. CURRENT SUBSCRIPTION BANNER (Gold Crown Card)
           ========================================================================= */}
        {isSubLoading ? (
          <div className="w-full max-w-4xl mx-auto h-52 rounded-[28px] bg-amber-50/50 animate-pulse border border-amber-100 mb-12" />
        ) : subscription ? (
          <div className="mb-12">
            <CurrentSubscriptionBanner subscription={subscription} hideActionButton={true} />
          </div>
        ) : null}


        {/* =========================================================================
            3. RENEWAL / UPGRADE SECTION HEADER
           ========================================================================= */}
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
            اختر باقة للتجديد أو الترقية
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
            تكرر الترقية بدلاً من توصيل الخطة السابقة تلقائياً
          </p>
        </div>

        {/* =========================================================================
            4. PACKAGES GRID
           ========================================================================= */}
        {isPkgLoading ? (
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[520px] rounded-[28px] border border-gray-100 bg-gray-50/70 animate-pulse p-8"
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {packages.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                index={index}
                isUpgrade={true}
                onSelect={handleSelectPackage}
                ctaOverrideText={
                  pkg.audience === "school" ? "اشترك عبر الواتساب" : "ترقية / تجديد الآن"
                }
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
    </div>
  );
};

export default PackageRenewView;

