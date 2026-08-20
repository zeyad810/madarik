import React, { Suspense } from "react";
import { Metadata } from "next";
import { AddChildView, AddChildSkeleton } from "@/features/parent";
import { RoleGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "إدارة حساب الطفل | مدارك القراءة",
  description: "إضافة أو تعديل حساب الطفل في منصة مدارك القراءة.",
};

export default function AddChildPage() {
  return (
    <RoleGuard
      allowedRoles={["parent", "free", "free_customer"]}
      loadingFallback={<AddChildSkeleton />}
    >
      <Suspense fallback={<AddChildSkeleton />}>
        <AddChildView />
      </Suspense>
    </RoleGuard>
  );
}