"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RefreshCw, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useVerifySubscriptionPayment } from "../hooks/usePayment";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export interface PaymentVerificationViewProps {
  paymentId: string;
}

export const PaymentVerificationView: React.FC<PaymentVerificationViewProps> = ({
  paymentId,
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useVerifySubscriptionPayment(paymentId, {
    refetchInterval: (query) => {
      const qData = (query as { state?: { data?: { status?: string } } })?.state?.data;
      if (qData?.status === "initiated") {
        return 3000; // Poll every 3s while initiated
      }
      return false;
    },
  });

  const isSuccess = data?.is_subscribed || data?.status === "paid" || data?.status === "success";
  const isFailed = data?.status === "failed" || isError;
  const isInitiated = data?.status === "initiated" || isLoading;

  return (
    <div className="w-full min-h-screen bg-white section-spacing pb-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-start mb-8">
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
                  التحقق من حالة الدفع
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-xl mx-auto rounded-[32px] border border-gray-200/90 bg-white p-8 sm:p-12 shadow-sm text-center"
        >
          {/* 1. LOADING / INITIATED STATE */}
          {isInitiated && !isSuccess && (
            <div className="space-y-6">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-purple-50 text-mad-main border border-purple-100">
                <RefreshCw className="size-10 animate-spin text-mad-main" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  جاري التحقق من حالة الدفعة...
                </h1>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  نتواصل الآن مع بوابة ميسر والبنك للتأكد من اكتمال المعاملة وتفعيل اشتراكك تلقائياً.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>رقم العملية: {paymentId}</span>
              </div>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {isSuccess && (
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200"
              >
                <CheckCircle2 className="size-10" />
              </motion.div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
                  <Sparkles className="size-3.5 text-emerald-600" />
                  <span>تم تفعيل الاشتراك بنجاح</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  تمت عملية الدفع بنجاح!
                </h1>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  شكراً لاشتراكك في منصة مدارك القراءة. يمكنك أنت وأطفالك الآن البدء في خوض مغامرات القراءة التفاعلية الممتعة.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  href="/stories"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>تصفح القصص والمستويات</span>
                  <ArrowLeft className="size-4 rotate-180" />
                </Link>
                <Link
                  href="/subscription-status"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all inline-flex items-center justify-center"
                >
                  عرض تفاصيل باقتي
                </Link>
              </div>
            </div>
          )}

          {/* 3. FAILED STATE */}
          {isFailed && (
            <div className="space-y-6">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-rose-50 text-rose-600 border-2 border-rose-200">
                <XCircle className="size-10" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  لم تكتمل عملية الدفع
                </h1>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  {error instanceof Error
                    ? error.message
                    : "تعذر إتمام الدفع أو تم رفض العملية من قبل البنك. يرجى التأكد من رصيد البطاقة والمحاولة مرة أخرى."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
                  <span>إعادة فحص الدفعة</span>
                </button>
                <Link
                  href="/packages"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-all"
                >
                  العودة لاختيار باقة أخرى
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentVerificationView;
