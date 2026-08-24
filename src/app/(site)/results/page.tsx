import React from "react";
import { AttemptsLogView } from "@/features/quiz";

export const metadata = {
  title: "نتائجي | مدارك",
  description: "سجل نتائج ومحاولات اختبارات القصص في منصة مدارك",
};

export default function ResultsPage() {
  return <AttemptsLogView />;
}
