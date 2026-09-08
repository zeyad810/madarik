"use client";

import React, { Suspense } from "react";
import { usePaymentReturn } from "@/features/payment/hooks/usePaymentReturn";
import { PaymentVerificationView } from "@/features/payment";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

function PaymentCallbackContent() {
  const { paymentId, streamPayId } = usePaymentReturn();

  if (paymentId) {
    return (
      <PaymentVerificationView
        paymentId={paymentId}
        streamPayId={streamPayId}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-xl">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 mb-6 border border-amber-200 shadow-sm">
          <AlertCircle className="size-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          معرّف الدفع غير موجود
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          تعذر العثور على بيانات العملية في رابط العودة. يرجى مراجعة تفاصيل اشتراكك الحالية أو العودة لاختيار الباقة.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/subscription-status"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
          >
            <span>حالة اشتراكي</span>
            <ArrowLeft className="size-4 rotate-180" />
          </Link>
          <Link
            href="/packages"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all inline-flex items-center justify-center"
          >
            تصفح الباقات
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="size-8 border-3 border-mad-main/30 border-t-mad-main rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
