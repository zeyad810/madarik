import React from "react";
import type { Metadata } from "next";
import { LegalPageView } from "@/features/site";

export const metadata: Metadata = {
  title: "سياسة الخصوصية وحماية البيانات | مدارك القراءة",
  description:
    "سياسة الخصوصية وبنود حماية البيانات الشخصية وبيانات الأطفال والالتزامات المتبادلة لضمان بيئة آمنة على منصة مدارك القراءة.",
  keywords: [
    "سياسة الخصوصية",
    "حماية البيانات",
    "خصوصية الأطفال",
    "مدارك القراءة",
    "أمان البيانات",
  ],
  openGraph: {
    title: "سياسة الخصوصية وحماية البيانات | مدارك القراءة",
    description:
      "سياسة الخصوصية وبنود حماية البيانات الشخصية وبيانات الأطفال والالتزامات المتبادلة لضمان بيئة آمنة على منصة مدارك القراءة.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="w-full flex-1">
      <LegalPageView type="privacy" />
    </main>
  );
}
