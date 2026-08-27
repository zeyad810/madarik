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
      loadingFallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="size-10 border-4 border-mad-main border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SettingsView />
    </RoleGuard>
  );
}
