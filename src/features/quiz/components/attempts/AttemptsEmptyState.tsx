import React from "react";
import Image from "next/image";
import Link from "next/link";

export const AttemptsEmptyState: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-6 sm:py-12 text-center gap-4">
      <div className="relative flex justify-center w-full max-w-sm">
        <Image
          src="/iamges/empty-history.png"
          alt="لم تقم بحل أي اختبار بعد"
          width={320}
          height={270}
          style={{ width: "auto", height: "auto" }}
          className="object-contain max-h-72 drop-shadow-sm"
          priority
        />
      </div>
      <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B4B] mt-2">
        لم تقم بحل أي اختبار بعد
      </h3>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 py-2.5 px-8 rounded-full border border-[#7939E3] text-[#7939E3] hover:bg-purple-50 transition-all font-bold text-sm shadow-xs active:scale-95 cursor-pointer mt-1"
      >
        <span>العودة للرئيسية</span>
        <span className="text-base leading-none">←</span>
      </Link>
    </main>
  );
};
