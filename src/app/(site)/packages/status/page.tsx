import React from "react";
import { Metadata } from "next";
import { SubscriptionStatusView, PackagesSelectionView } from "@/features/packages";
import { RoleGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "حالة اشتراكي | مدارك القراءة",
  description: "اطلع على تفاصيل باقتك الحالية النشطة ومواعيد التجديد وطرق الدفع.",
};

export default function SubscriptionStatusPage() {
  return (
    <RoleGuard
      allowedRoles={["parent", "free", "free_customer"]}
      fallback={<PackagesSelectionView />}
      loadingFallback={<SubscriptionStatusView />}
    >
      <SubscriptionStatusView />
    </RoleGuard>
  );
}
