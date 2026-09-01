"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, AlertCircle, Inbox } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { usePackageHistory } from "../hooks/usePackages";
import { HistoryFilterType, PackageHistoryItem } from "../types";
import { InvoiceModal } from "./InvoiceModal";

const FILTER_TABS: { id: HistoryFilterType; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "active", label: "نشط" },
  { id: "expired", label: "منتهي" },
  { id: "cancelled", label: "ملغاة" },
];

export const PackageHistoryView: React.FC = () => {
  const { data: history = [], isLoading } = usePackageHistory();
  const [activeFilter, setActiveFilter] = useState<HistoryFilterType>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<PackageHistoryItem | null>(null);

  const filteredHistory = useMemo(() => {
    if (activeFilter === "all") return history;
    if (activeFilter === "active") {
      return history.filter((item) => item.status === "active");
    }
    if (activeFilter === "expired") {
      return history.filter((item) => item.status === "expired" || item.status === "free");
    }
    if (activeFilter === "cancelled") {
      return history.filter((item) => item.status === "cancelled");
    }
    return history;
  }, [history, activeFilter]);

  const renderStatusBadge = (item: PackageHistoryItem) => {
    switch (item.status) {
      case "active":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            {item.statusLabel || "نشط"}
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
            {item.statusLabel || "منتهية"}
          </span>
        );
      case "free":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
            {item.statusLabel || "مجانية"}
          </span>
        );
      case "cancelled":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            {item.statusLabel || "ملغاة"}
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-start mb-6">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" className="text-mad-main font-bold hover:underline">
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-gray-500 font-medium">
                  تاريخ وسجل الباقات
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* =========================================================================
            2. PAGE HEADER
           ========================================================================= */}
        <div className="text-right space-y-1.5 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            تاريخ وسجل الباقات
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            اطلع على جميع العمليات والاشتراكات السابقة والتأكد من الفواتير
          </p>
        </div>

        {/* =========================================================================
            3. CONTROLS: TABS + NOTICE
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-gray-100/70 p-1.5 rounded-full self-start">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-mad-main text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Download notice */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="size-4 text-mad-main shrink-0" />
            <span>يمكنك تحميل الفاتورة بالنقر على الإيصال بجانب أي مدفوعات.</span>
          </div>
        </div>

        {/* =========================================================================
            4. HISTORY DATA TABLE
           ========================================================================= */}
        <div className="rounded-[24px] border border-gray-200/90 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-gray-50/80 text-gray-600 font-bold border-b border-gray-200/80">
                  <th className="py-4 px-4 sm:px-6">اسم الباقة</th>
                  <th className="py-4 px-4">نوع الباقة</th>
                  <th className="py-4 px-4">الفئة العمرية</th>
                  <th className="py-4 px-4">السعر</th>
                  <th className="py-4 px-4">تاريخ البدء</th>
                  <th className="py-4 px-4">تاريخ الانتهاء</th>
                  <th className="py-4 px-4">الحالة</th>
                  <th className="py-4 px-4">طريقة الدفع</th>
                  <th className="py-4 px-4 sm:px-6 text-center">رقم العملية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {isLoading ? (
                  [1, 2, 3, 4].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={9} className="py-4 px-6">
                        <div className="h-6 bg-gray-100 rounded-md w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <Inbox className="size-6 stroke-[1.8]" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          لا توجد سجلات اشتراكات أو فواتير سابقة
                        </p>
                        <p className="text-xs text-gray-400 max-w-sm">
                          عند الاشتراك في باقة أو إجراء عملية دفع ستظهر تفاصيلها وفواتيرها هنا تلقائياً.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-purple-50/30 transition-colors"
                    >
                      {/* 1. Package Name */}
                      <td className="py-4 px-4 sm:px-6 font-bold text-gray-900">
                        {item.packageName}
                      </td>

                      {/* 2. Type */}
                      <td className="py-4 px-4 text-gray-600">
                        {item.packageType}
                      </td>

                      {/* 3. Age Group */}
                      <td className="py-4 px-4 text-gray-600">
                        {item.ageCategory}
                      </td>

                      {/* 4. Price */}
                      <td className="py-4 px-4 font-bold text-mad-main">
                        {item.price} {item.currency && !String(item.price).includes(item.currency) ? item.currency : ""}
                      </td>

                      {/* 5. Start Date */}
                      <td className="py-4 px-4 text-gray-600">
                        {item.startDate}
                      </td>

                      {/* 6. End Date */}
                      <td className="py-4 px-4 text-gray-600">
                        {item.endDate}
                      </td>

                      {/* 7. Status Badge */}
                      <td className="py-4 px-4">
                        {renderStatusBadge(item)}
                      </td>

                      {/* 8. Payment Method */}
                      <td className="py-4 px-4 text-gray-600">
                        {item.paymentMethod}
                      </td>

                      {/* 9. Invoice / Action */}
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-mad-main text-xs font-semibold text-gray-700 hover:text-mad-main hover:bg-purple-50/60 transition-all cursor-pointer shadow-2xs"
                        >
                          <FileText className="size-3.5" />
                          <span>{item.invoiceNumber}</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Modal */}
        <InvoiceModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          item={selectedInvoice}
        />
      </div>
    </div>
  );
};

export default PackageHistoryView;
