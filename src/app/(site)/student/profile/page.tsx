import React from "react";
import { Metadata } from "next";
import { RoleGuard } from "@/components/guards";
import { StudentProfileView } from "@/features/student";

export const metadata: Metadata = {
  title: "الملف الشخصي للطالب | مدارك",
  description: "عرض بيانات الطالب والفئة العمرية في منصة مدارك.",
};

export default function StudentProfilePage() {
  return (
    <RoleGuard
      allowedRoles={["student"]}
      loadingFallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="size-10 border-4 border-mad-main border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentProfileView />
    </RoleGuard>
  );
}
