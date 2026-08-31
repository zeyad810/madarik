"use client";

import React from "react";
import { Bell } from "lucide-react";

export const NotificationEmptyState: React.FC = () => {
  return (
    <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
      <div className="size-16 sm:size-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400 shadow-2xs">
        <Bell className="size-8 stroke-[1.5] text-slate-400" />
      </div>
      <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
        لا توجد إشعارات جديدة
      </h4>
      <p className="text-xs sm:text-sm text-slate-400 text-center max-w-xs leading-relaxed">
        ستظهر التنبيهات وأنشطة طفلك هنا فور حدوثها
      </p>
    </div>
  );
};

export default NotificationEmptyState;
