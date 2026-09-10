import React from "react";
import { Metadata } from "next";
import { RoleGuard } from "@/components/guards";
import { ProfileContainer } from "../profile/ProfileContainer";

export const metadata: Metadata = {
  title: "الإعدادات | مدارك",
  description: "عرض وإدارة إعدادات الحساب في منصة مدارك.",
};

export default function SettingsPage() {
  return (
    <RoleGuard
      allowedRoles={["parent", "free", "free_customer", "student"]}
      loadingFallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="size-10 border-4 border-mad-main border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProfileContainer />
    </RoleGuard>
  );
}

