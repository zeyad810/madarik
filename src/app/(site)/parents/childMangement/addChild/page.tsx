import React from "react";
import { Metadata } from "next";
import { AddChildView } from "@/features/parent";
import { RoleGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "إنشاء حساب طفل جديد | مدارك القراءة",
  description: "أضف حساباً خاصاً بطفلك لتمكينه من استكشاف القصص التعليمية الموجهة وحل الاختبارات التفاعلية الممتعة.",
};

export default function AddChildPage() {
  return (
    <RoleGuard allowedRoles={["parent", "free", "free_customer"]}>
      <AddChildView />
    </RoleGuard>
  );
}