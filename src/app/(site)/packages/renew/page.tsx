import React from "react";
import { Metadata } from "next";
import { PackageRenewView, PackagesSelectionView } from "@/features/packages";
import { RoleGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "تجديد الاشتراك | مدارك القراءة",
  description: "اختر باقة للتجديد أو الترقية وتعرّف على تفاصيل باقتك الحالية.",
};

export default function PackageRenewPage() {
  return (
    <RoleGuard
      allowedRoles={["parent", "free", "free_customer"]}
      fallback={<PackagesSelectionView />}
      loadingFallback={<PackageRenewView />}
    >
      <PackageRenewView />
    </RoleGuard>
  );
}
