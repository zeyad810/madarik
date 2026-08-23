import type { Metadata } from "next";
import { ChildsReports } from "@/features/parent";
import { RoleGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "تقارير الأطفال - مدارك القراءة",
  description: "شاهد وقم بإدارة حسابات أطفالك وتابع تقدمهم القرائي واختباراتهم بكل سهولة.",
};

export default function ChildReportsPage() {
  return (
    <RoleGuard
      allowedRoles={["parent", "free", "free_customer"]}
      loadingFallback={<ChildsReports />}
    >
      <ChildsReports />
    </RoleGuard>
  );
}