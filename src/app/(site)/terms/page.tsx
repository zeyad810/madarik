import React from "react";
import type { Metadata } from "next";
import { LegalPageView } from "@/features/site";

export const metadata: Metadata = {
  title: "الشروط والأحكام واتفاقية الاستخدام | مدارك القراءة",
  description:
    "شروط الخدمة والالتزامات المتبادلة لضمان رحلة استخدام آمنة ومريحة لكافة الأسر والمؤسسات التعليمية الشريكة على منصة مدارك القراءة.",
  keywords: [
    "شروط الاستخدام",
    "الأحكام والشروط",
    "اتفاقية الاستخدام",
    "مدارك القراءة",
    "سياسة الخدمة",
  ],
  openGraph: {
    title: "الشروط والأحكام واتفاقية الاستخدام | مدارك القراءة",
    description:
      "شروط الخدمة والالتزامات المتبادلة لضمان رحلة استخدام آمنة ومريحة لكافة الأسر والمؤسسات التعليمية الشريكة.",
  },
};

export default function TermsPage() {
  return (
    <main className="w-full flex-1">
      <LegalPageView type="terms" />
    </main>
  );
}
