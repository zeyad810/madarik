"use client";

import React from "react";
import { Calendar } from "lucide-react";

export const ChildFormSkeleton: React.FC<{ isEditMode?: boolean }> = ({ isEditMode = false }) => {
  return (
    <div
      className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-10 animate-pulse select-none"
      dir="rtl"
    >
      {/* Card Header */}
      <h2 className="text-mad-main font-bold text-lg sm:text-xl">
        بيانات ملف الطفل
      </h2>
      <div className="border-b border-gray-100 mt-4 mb-8" />

      {/* Form Skeleton */}
      <div className="space-y-8">
        {/* Account Status Row (if in edit mode) */}
        {isEditMode && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
            <span className="text-xs sm:text-sm font-bold text-gray-800">
              حالة حساب الطفل
            </span>
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-10 bg-gray-200/80 rounded" />
              <div className="w-11 h-6 bg-gray-200 rounded-full" />
            </div>
          </div>
        )}

        {/* Form Fields Grid: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Field 1: Child Name */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-gray-800 text-right">
              اسم الطفل <span className="text-red-500">*</span>
            </label>
            <div className="w-full h-[48px] sm:h-[50px] border border-gray-200/80 rounded-2xl bg-gray-50/50" />
          </div>

          {/* Field 2: Birth Date */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-gray-800 text-right">
              تاريخ الميلاد <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="w-full h-[48px] sm:h-[50px] border border-gray-200/80 rounded-2xl bg-gray-50/50" />
              <Calendar className="size-4.5 text-gray-300 absolute right-4 pointer-events-none stroke-[2]" />
            </div>
          </div>

          {/* Field 3: Age (Auto-calculated) */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-gray-800 text-right">
              العمر (تحدد تلقائياً)
            </label>
            <div className="w-full h-[48px] sm:h-[50px] border border-gray-200/80 rounded-2xl bg-gray-50/70" />
          </div>

          {/* Field 4: Gender */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-gray-800 text-right">
              الجنس <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-6 pt-2 h-[32px]">
              <div className="flex items-center gap-2">
                <div className="size-4.5 rounded-full bg-gray-200/80" />
                <span className="text-xs sm:text-sm font-bold text-gray-400">
                  أنثى
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4.5 rounded-full bg-gray-200/80" />
                <span className="text-xs sm:text-sm font-bold text-gray-400">
                  ذكر
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions Checkbox (if in add mode) */}
        {!isEditMode && (
          <div className="pt-2">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="size-4.5 mt-0.5 sm:mt-0 rounded-md bg-gray-200/80 shrink-0" />
              <span className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed text-right">
                أوافق على شروط الاشتراك وسياسة الاستخدام المخصصة للأطفال في منصة مدارك القراءة.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-start gap-4 pt-4">
          <div className="px-8 py-3 rounded-full bg-mad-main/40 text-white/80 font-bold text-sm sm:text-base min-w-[140px] h-[46px] sm:h-[48px] flex items-center justify-center">
            {isEditMode ? "حفظ التعديلات" : "حفظ التغيرات"}
          </div>
          <div className="px-8 py-3 rounded-full border border-gray-200 text-gray-400 font-bold text-sm sm:text-base min-w-[120px] h-[46px] sm:h-[48px] flex items-center justify-center">
            إلغاء
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildFormSkeleton;
