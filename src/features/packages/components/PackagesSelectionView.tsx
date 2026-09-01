"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PackageCard } from "./PackageCard";
import { usePackagesList } from "../hooks/usePackages";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { CheckoutModal } from "@/features/payment";
import { PackagePlan } from "../types";

export const PackagesSelectionView: React.FC = () => {
  const router = useRouter();
  const { data: packages = [], isLoading: isPkgsLoading } = usePackagesList();
  const {
    isAuthenticated,
    isStudent,
    userRole,
    activeAccount,
    isLoading: isAuthLoading,
  } = useActiveAccount();

  const [selectedPackageForCheckout, setSelectedPackageForCheckout] = useState<PackagePlan | null>(null);

  const isChildOrStudent =
    isStudent ||
    userRole === "student" ||
    userRole === "child" ||
    activeAccount?.type === "child";

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && isChildOrStudent) {
      router.push("/stories");
    }
  }, [isAuthLoading, isAuthenticated, isChildOrStudent, router]);

  if (isChildOrStudent) {
    return null;
  }

  const isLoading = isPkgsLoading || isAuthLoading;

  const handleSelectPackage = (pkg: PackagePlan) => {
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
                  اختيار الباقة
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* =========================================================================
            2. PAGE HEADER
           ========================================================================= */}
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            اختر الباقة المناسبة لطفلك
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-normal leading-relaxed">
            باقات مرنة تناسب جميع المراحل العمرية، تمنح طفلك تجربة قراءة تفاعلية ممتعة وآمنة.
          </p>
        </div>

        {/* =========================================================================
            3. PACKAGES CARDS GRID
           ========================================================================= */}
        {isLoading ? (
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[520px] rounded-[28px] border border-gray-100 bg-gray-50/70 animate-pulse p-8"
              />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 px-6 rounded-3xl border border-gray-100 bg-gray-50/50">
            <p className="text-sm font-semibold text-gray-700">لا توجد باقات متاحة حالياً</p>
            <p className="text-xs text-gray-400 mt-1">يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني.</p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {packages.map((pkg, index) => (
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
    </div>
  );
};

export default PackagesSelectionView;

