import React from "react";
import { Metadata } from "next";
import { ChildManagementView } from "@/features/parent";
import { RoleGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "إدارة الأطفال | مدارك القراءة",
  description: "شاهد وقم بإدارة حسابات أطفالك، وتابع تقدمهم القرائي واختباراتهم بكل سهولة.",
};

export default function ChildManagementPage() {
  return (
    <RoleGuard allowedRoles={["parent", "free", "free_customer"]}>
      <ChildManagementView />
    </RoleGuard>
  );
}