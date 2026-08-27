"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Download, CheckCircle2, FileText } from "lucide-react";
import { PackageHistoryItem } from "../types";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PackageHistoryItem | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!isOpen || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-gray-100 text-right overflow-hidden"
        >
          {/* Top Bar Actions */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-mad-main">
              <FileText className="size-5" />
              <span className="font-bold text-base text-gray-900">
                فاتورة إلكترونية ضريبية
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Invoice Body */}
          <div className="py-5 space-y-4 text-xs sm:text-sm">
            {/* Header info */}
            <div className="flex items-center justify-between bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
              <div>
                <p className="text-gray-500 text-xs">رقم الفاتورة / العملية</p>
                <p className="font-extrabold text-mad-main text-base mt-0.5">
                  {item.invoiceNumber}
                </p>
              </div>
              <div className="text-left" dir="ltr">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                  مدفوع
                </span>
              </div>
            </div>

            {/* Details Table */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
              <div className="flex justify-between py-2.5 px-4 bg-gray-50/50">
                <span className="text-gray-500">اسم الباقة</span>
                <span className="font-bold text-gray-900">{item.packageName}</span>
              </div>
              <div className="flex justify-between py-2.5 px-4">
                <span className="text-gray-500">نوع الاشتراك</span>
                <span className="font-semibold text-gray-800">{item.packageType}</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 bg-gray-50/50">
                <span className="text-gray-500">الفئة العمرية</span>
                <span className="font-semibold text-gray-800">{item.ageCategory}</span>
              </div>
              <div className="flex justify-between py-2.5 px-4">
                <span className="text-gray-500">تاريخ البدء</span>
                <span className="font-semibold text-gray-800">{item.startDate}</span>
              </div>
              <div className="flex justify-between py-2.5 px-4 bg-gray-50/50">
                <span className="text-gray-500">تاريخ الانتهاء</span>
                <span className="font-semibold text-gray-800">{item.endDate}</span>
              </div>
              <div className="flex justify-between py-2.5 px-4">
                <span className="text-gray-500">طريقة الدفع</span>
                <span className="font-semibold text-gray-800">{item.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-purple-50/40">
                <span className="font-bold text-gray-900">المبلغ الإجمالي</span>
                <span className="font-extrabold text-mad-main text-base">
                  {item.price} {item.currency && !String(item.price).includes(item.currency) ? item.currency : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer className="size-4" />
              <span>طباعة الفاتورة</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="py-3 px-5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="size-4" />
              <span>تحميل PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InvoiceModal;
