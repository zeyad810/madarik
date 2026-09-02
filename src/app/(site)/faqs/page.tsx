import React from "react";
import type { Metadata } from "next";
import { FaqPageView } from "@/features/site";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | منصة مدارك القراءة",
  description:
    "إجابات شاملة عن كل ما تود معرفته عن منصة مدارك القراءة، الباقات، الاشتراكات، واختبارات قياس مستوى القراءة للأطفال.",
};

export default function FaqsPage() {
  return <FaqPageView />;
}
