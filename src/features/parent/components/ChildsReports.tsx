"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlusCircle } from "lucide-react";
import { useChildReports } from "../hooks";
import { ChildReportCard, ChildReportCardSkeleton } from "./ChildReportCard";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { SubscriptionRequiredFallback } from "@/components/guards";

export const ChildsReports: React.FC = () => {
  const { isFreeCustomer } = useActiveAccount();
  const { reports, isLoading } = useChildReports();

  if (isFreeCustomer) {
    return <SubscriptionRequiredFallback />;
  }

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-16!" dir="rtl">
      <div className="container mx-auto">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-start">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  href="/"
                  className="text-mad-main font-bold hover:underline"
                >
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-gray-500 font-medium">
                  تقارير الأطفال
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* =========================================================================
            2. PAGE HEADER (Title + Description)
           ========================================================================= */}
        <div className="pt-2 pb-6 space-y-1 text-right">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            تقارير الأطفال
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-xl">
            شاهد وقم بإدارة حسابات أطفالك، وتابع تقدمهم القرائي واختباراتهم بكل سهولة.
          </p>
        </div>

        {/* =========================================================================
            3. CARDS GRID / SKELETON / EMPTY STATE
           ========================================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ChildReportCardSkeleton key={idx} />
            ))}
          </div>
        ) : reports && reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {reports.map((child) => (
              <ChildReportCard
                key={child.id}
                child={child}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 border-2 border-dashed border-gray-200 rounded-3xl p-8 bg-gray-50/50 mt-4">
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              لا توجد تقارير أطفال متاحة حالياً.
            </p>
            <Link
              href="/parents/childMangement/addChild?mode=add"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle className="size-5 stroke-[2.2]" />
              <span>إضافة طفل الآن</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildsReports;