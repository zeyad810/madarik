"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export interface AccessDeniedFallbackProps {
  title?: string;
  message?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export const AccessDeniedFallback: React.FC<AccessDeniedFallbackProps> = ({
  title = "غير مصرح بالوصول",
  message = "هذه الصفحة مخصصة لحسابات أولياء الأمور والعملاء فقط لإدارة بيانات ومتابعة تقدم الأطفال.",
  buttonText = "العودة للرئيسية",
  buttonHref = "/",
  className = "",
}) => {
  return (
    <div
      className={`w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 ${className}`}
      dir="rtl"
    >
      <div className="size-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 shadow-sm border border-red-100/80">
        <ShieldAlert className="size-10 stroke-[2]" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-gray-600 max-w-md mb-6 text-sm sm:text-base leading-relaxed">
        {message}
      </p>
      <Link
        href={buttonHref}
        className="px-6 py-2.5 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default AccessDeniedFallback;
