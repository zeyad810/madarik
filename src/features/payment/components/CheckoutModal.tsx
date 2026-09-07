"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { PackagePlan } from "@/features/packages/types";
import { useCheckoutSubscription, useVerifySubscriptionPayment } from "../hooks/usePayment";
import { StreamCheckoutEmbed } from "./StreamCheckoutEmbed";
import toast from "react-hot-toast";

export interface CheckoutModalProps {
  isOpen: boolean;
  pkg: PackagePlan | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  pkg,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [streamPaymentUrl, setStreamPaymentUrl] = useState<string | null>(null);
  const [isStreamEmbedActive, setIsStreamEmbedActive] = useState(false);

  const { mutate: checkout, isPending: isCheckingOut } = useCheckoutSubscription();

  // Verification hook when payment completes
  const { refetch: verifyPayment, isFetching: isVerifying } = useVerifySubscriptionPayment(
    activePaymentId,
    { enabled: false }
  );

  if (!isOpen || !pkg) return null;

  const effectivePrice = pkg.discountedPrice ?? pkg.price;
  const priceDisplay = effectivePrice ? `${effectivePrice} ${pkg.currency || "ر.س"}` : "";

  const isFreePackage =
    !effectivePrice ||
    Number(effectivePrice) === 0 ||
    pkg.price === 0 ||
    pkg.discountedPrice === 0;

  const handleCheckout = () => {
    setErrorMessage(null);

    checkout(
      {
        package_id: pkg.id,
      },
      {
        onSuccess: (res) => {
          const paymentId = res.data?.payment_id;
          const redirectUrl = res.data?.payment_url || res.data?.transaction_url;
          const status = res.data?.status;

          if (paymentId) setActivePaymentId(paymentId);

          // Free package or immediately paid
          if (
            isFreePackage ||
            status === "paid" ||
            status === "success" ||
            (!redirectUrl && res.success)
          ) {
            setPaymentSuccess(true);
            toast.success("تم تفعيل اشتراكك بنجاح! مرحباً بك في مدارك");
            if (onSuccess) onSuccess();
            return;
          }

          // Open embedded StreamPay checkout inside modal
          if (redirectUrl) {
            setStreamPaymentUrl(redirectUrl);
            setIsStreamEmbedActive(true);
            return;
          }

          if (status === "failed") {
            setErrorMessage("لم تتم عملية الدفع بنجاح. يرجى المحاولة مرة أخرى.");
          }
        },
        onError: (err) => {
          const msg = err?.message || "تعذر بدء عملية الدفع. يرجى المحاولة لاحقاً.";
          setErrorMessage(msg);
          toast.error(msg);
        },
      }
    );
  };

  const handleVerifyAndConfirm = async () => {
    if (!activePaymentId) return;
    try {
      toast.loading("جاري التحقق من حالة الدفع وتفعيل الاشتراك...", { id: "verify-toast" });
      const res = await verifyPayment();
      toast.dismiss("verify-toast");
      if (res.data?.is_subscribed || res.data?.status === "paid" || res.data?.status === "success") {
        setIsStreamEmbedActive(false);
        setPaymentSuccess(true);
        toast.success("تم تأكيد وتفعيل اشتراكك بنجاح! مرحباً بك في مدارك");
        if (onSuccess) onSuccess();
      } else if (res.data?.status === "failed") {
        toast.error("لم تكتمل عملية الدفع أو تم رفضها من قبل البنك.");
      } else {
        toast("العملية قيد المعالجة، يرجى الانتظار ثوانٍ ثم الضغط مجدداً للتأكيد.", { icon: "⏳" });
      }
    } catch {
      toast.dismiss("verify-toast");
      toast.error("تعذر التحقق من الدفعة حالياً، يرجى المحاولة مجدداً.");
    }
  };

  const handleCloseAll = () => {
    setIsStreamEmbedActive(false);
    setStreamPaymentUrl(null);
    setPaymentSuccess(false);
    setErrorMessage(null);
    setActivePaymentId(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseAll}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-2xl bg-mad-purple-100 text-mad-main">
                <Sparkles className="size-4" />
              </div>
              <div className="text-right">
                <h3 className="text-base font-bold text-gray-900">
                  {paymentSuccess ? "اكتمل الاشتراك بنجاح" : isStreamEmbedActive ? "إتمام الدفع الآمن" : "تأكيد الاشتراك في الباقة"}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {paymentSuccess
                    ? "تم تفعيل حسابك ويمكنك الاستفادة من جميع المميزات"
                    : isStreamEmbedActive
                    ? "بوابة الدفع الإلكتروني المعتمدة (StreamPay)"
                    : pkg.name}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseAll}
              className="flex size-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Success State */}
            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm animate-bounce">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-gray-900">تهانينا! تم تفعيل اشتراكك بنجاح</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    تمت معالجة الدفع عبر StreamPay واشتراكك في باقة &quot;{pkg.name}&quot; أصبح نشطاً الآن.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseAll();
                    router.push("/packages/status");
                  }}
                  className="mt-4 px-6 py-3 rounded-xl bg-mad-main text-white font-bold text-sm shadow-md hover:bg-mad-purple-800 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>عرض تفاصيل اشتراكي</span>
                  <ArrowRight className="size-4 rotate-180" />
                </button>
              </div>
            ) : isStreamEmbedActive && streamPaymentUrl ? (
              /* StreamPay Embedded Checkout */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <h4 className="text-sm font-bold text-gray-900">
                      بوابة الدفع الآمنة
                    </h4>
                    <span className="text-xs text-gray-500 font-medium">
                      الدفع عبر StreamPay ({priceDisplay})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsStreamEmbedActive(false)}
                    className="text-xs text-mad-main font-semibold hover:underline cursor-pointer"
                  >
                    تغيير الخيارات
                  </button>
                </div>

                <StreamCheckoutEmbed
                  paymentUrl={streamPaymentUrl}
                  paymentId={activePaymentId || ""}
                  onSuccess={handleVerifyAndConfirm}
                  onError={(err) => setErrorMessage(err)}
                />
              </div>
            ) : (
              <>
                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-rose-700 text-xs font-medium"
                  >
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* Selected Package Summary Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 p-4 sm:p-5">
                  <div className="flex items-center gap-3.5">
                    <div className="relative size-12 shrink-0">
                      <Image
                        src={pkg.icon}
                        alt={pkg.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-mad-main">الباقة المختارة</span>
                      <h4 className="text-base font-bold text-gray-900">{pkg.name}</h4>
                      {pkg.durationLabel && (
                        <span className="text-xs text-gray-500 font-medium">
                          المدة: {pkg.durationLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                    <div className="text-lg font-black text-gray-900">
                      {isFreePackage ? (
                        <span className="text-emerald-600 font-bold text-base">مجاناً</span>
                      ) : (
                        priceDisplay
                      )}
                    </div>
                    {pkg.discountedPrice && pkg.price && (
                      <span className="text-[11px] text-gray-400 line-through block">
                        {pkg.price} {pkg.currency || "ر.س"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Package Features List */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-700 block">
                      مميزات الباقة:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pkg.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-xl"
                        >
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Free Package Flow */}
                {isFreePackage ? (
                  <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-6 text-center space-y-4">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <Sparkles className="size-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-gray-900">
                        باقة مجانية متاحة لحسابك
                      </h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        لا تتطلب هذه الباقة أي بطاقة دفع أو رسوم. اضغط أدناه لتفعيل اشتراكك والبدء فوراً.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isCheckingOut ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>تفعيل الاشتراك المجاني الآن</span>
                          <CheckCircle2 className="size-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* Paid Package Flow with StreamPay */
                  <div className="rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50/50 to-white p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-5 text-emerald-600" />
                        <span className="text-sm font-bold text-gray-900">
                          بوابة الدفع الآمنة (StreamPay)
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-mad-main bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                        دفع آمن 100%
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      ادفع بأمان عبر مدى، فيزا، ماستركارد، أو Apple Pay من خلال بوابة StreamPay المعتمدة.
                    </p>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isCheckingOut || isVerifying}
                      className="w-full py-4 px-6 rounded-2xl bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-lg shadow-purple-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isCheckingOut ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>متابعة الدفع عبر StreamPay ({priceDisplay})</span>
                          <ArrowRight className="size-4 rotate-180" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
