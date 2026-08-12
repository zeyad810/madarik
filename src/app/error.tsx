"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { RefreshCw, Home, AlertTriangle, ArrowRight } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-mad-white-50 font-sans">
      {/* Site Header */}
      <Header />

      {/* Main Error Container */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Ambient Red/Purple Background Glows */}
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-mad-purple-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-mad-danger-light rounded-full blur-2xl pointer-events-none" />

        <div className="container relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Animated Warning Icon Card */}
          <div className="relative mb-6 sm:mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-mad-white-50 border-2 border-mad-purple-200 shadow-xl flex items-center justify-center text-mad-purple-600 animate-pulse duration-1000">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-mad-purple-100/80 flex items-center justify-center text-mad-purple-600">
                <AlertTriangle className="w-9 h-9 sm:w-11 sm:h-11 text-mad-purple-600" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* Error Heading */}
          <h1 className="mad-h2 font-extrabold text-mad-text-primary tracking-tight">
            عذراً، حدث خطأ غير متوقع!
          </h1>

          {/* Subtitle / Message */}
          <p className="mad-body-1 text-mad-text-secondary mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed">
            نعتذر عن هذا الخلل الفني المؤقت. لقد تم تسجيل المشكلة تلقائياً للعمل على حلها. يمكنك محاولة إعادة تحميل الصفحة أو العودة للصفحة الرئيسية.
          </p>

          {/* Optional Error Digest Badge for Debugging */}
          {error?.digest && (
            <div className="mt-4 px-3 py-1.5 rounded-md bg-mad-white-100 border border-mad-white-300 text-xs font-mono text-mad-text-secondary dir-ltr">
              رمز الخطأ: {error.digest}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 w-full max-w-lg">
            {/* Try Again Button */}
            <button
              type="button"
              onClick={() => reset()}
              className="bg-linear-to-r from-mad-purple-600 via-mad-purple-700 to-mad-purple-800 hover:from-mad-purple-700 hover:to-mad-purple-900 text-mad-white-50 font-bold mad-label-1 px-8 py-4 rounded-full inline-flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-mad-purple-600/30 hover:shadow-xl hover:shadow-mad-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex-1 min-w-[200px] group cursor-pointer"
            >
              <RefreshCw className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
              <span>إعادة المحاولة</span>
            </button>

            {/* Back to Home Button */}
            <Link
              href="/"
              className="bg-mad-white-50 hover:bg-mad-purple-100/60 text-mad-purple-600 border-2 border-mad-purple-200 hover:border-mad-purple-500 font-bold mad-label-1 px-8 py-4 rounded-full inline-flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex-1 min-w-[200px] group cursor-pointer"
            >
              <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>الرئيسية</span>
              <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
