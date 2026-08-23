import React from "react";
import type { Metadata } from "next";
import { ChildReport } from "@/features/parent";
import { RoleGuard } from "@/components/guards";
import { ChildReportDetailSkeleton } from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "نتائج الطفل | مدارك القراءة",
  description: "تقرير تفصيلي لنتائج واختبارات الطفل وقراءاته على منصة مدارك القراءة.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <RoleGuard
      allowedRoles={["parent", "free", "free_customer"]}
      loadingFallback={<ChildReportDetailSkeleton />}
    >
      <ChildReport childId={id} />
    </RoleGuard>
  );
};

export default Page;
