import React from "react";
import { Metadata } from "next";
import { PackageHistoryView, PackagesSelectionView } from "@/features/packages";
import { RoleGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "تاريخ وسجل الباقات | مدارك القراءة",
  description: "اطلع على جميع العمليات والاشتراكات السابقة والتأكد من الفواتير.",
};

export default function PackageHistoryPage() {
  return (
    <RoleGuard
      allowedRoles={["parent", "free", "free_customer"]}
      fallback={<PackagesSelectionView />}
      loadingFallback={<PackageHistoryView />}
    >
      <PackageHistoryView />
    </RoleGuard>
  );
}
