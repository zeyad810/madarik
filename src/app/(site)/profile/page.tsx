import React from "react";
import { Metadata } from "next";
import { SettingsView } from "@/features/parent";
import { RoleGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "حساب ولي الأمر | مدارك القراءة",
  description: "إدارة بياناتك ومتابعة رحلة أطفالك التعليمية من مكان واحد.",
};

export default function ParentAccountSettingsPage() {
  return (
    <RoleGuard
      allowedRoles={["parent", "free", "free_customer"]}
      loadingFallback={<SettingsView />}
    >
      <SettingsView />
    </RoleGuard>
  );
}
