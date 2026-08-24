import React from "react";
import { AttemptsLogView } from "@/features/quiz";

export const metadata = {
  title: "سجل المحاولات | مدارك",
  description: "سجل نتائج ومحاولات اختبارات القصص في منصة مدارك",
};

export default function AttemptsPage() {
  return <AttemptsLogView />;
}
