"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface QuizErrorViewProps {
  storyId: string;
  type?: "error" | "empty";
}

export const QuizErrorView: React.FC<QuizErrorViewProps> = ({
  storyId,
  type = "error",
}) => {
  if (type === "empty") {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FAFAFC] px-4"
      >
        <p className="text-slate-700 font-bold text-center">
          هذا الاختبار لا يحتوي على أسئلة بعد.
        </p>
        <Link
          href={`/stories/${storyId}`}
          className="py-2.5 px-6 rounded-full bg-[#7939E3] text-white font-bold text-sm shadow-md"
        >
          العودة للقصة
        </Link>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FAFAFC] px-4"
    >
      <Image
        src="/iamges/q-fail-quiz.png"
        alt="خطأ"
        width={250}
        height={250}
        style={{ width: "auto", height: "auto" }}
        priority
      />
      <p className="text-slate-700 font-bold text-center">
        تعذر تحميل الاختبار. يرجى المحاولة لاحقاً.
      </p>
      <Link
        href={`/stories/${storyId}`}
        className="py-2.5 px-6 rounded-full bg-[#7939E3] text-white font-bold text-sm shadow-md"
      >
        العودة للقصة
      </Link>
    </div>
  );
};

export default QuizErrorView;
