import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const AttemptsAccessDenied: React.FC = () => {
  return (
    <div
      dir="rtl"
      className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4"
    >
      <div className="size-20 rounded-full bg-purple-50 flex items-center justify-center text-[#7939E3]">
        <AlertCircle className="size-10" />
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center">
        سجل المحاولات متاح لطلاب ومشتركي المنصة فقط
      </h2>
      <p className="text-sm text-slate-500 font-medium text-center max-w-md">
        يمكنك تصفح وقراءة القصص المتاحة وخوض الاختبارات في أي وقت.
      </p>
      <Link
        href="/stories"
        className="py-3 px-8 rounded-full bg-[#7939E3] hover:bg-[#6D28D9] text-white font-bold text-sm transition-all shadow-md active:scale-95"
      >
        تصفح القصص
      </Link>
    </div>
  );
};
