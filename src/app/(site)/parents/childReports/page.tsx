import type { Metadata } from "next";
import { ChildsReports } from "@/features/parent";

export const metadata: Metadata = {
  title: "تقارير الأطفال - مدارك القراءة",
  description: "شاهد وقم بإدارة حسابات أطفالك وتابع تقدمهم القرائي واختباراتهم بكل سهولة.",
};

export default function ChildReportsPage() {
  return <ChildsReports />;
}