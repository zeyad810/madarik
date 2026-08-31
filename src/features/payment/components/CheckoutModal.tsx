"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { PackagePlan } from "@/features/packages/types";
import { MoyasarCreditCardSource } from "../types";
import { useCheckoutSubscription, useVerifySubscriptionPayment } from "../hooks/usePayment";
import { CreditCardForm } from "./CreditCardForm";
import { Payment3DSecureModal } from "./Payment3DSecureModal";
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
  const [transactionUrl, setTransactionUrl] = useState<string | null>(null);
  const [is3DSOpen, setIs3DSOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: checkout, isPending: isCheckingOut } = useCheckoutSubscription();

  // Verification hook if 3DS was initiated
  const { refetch: verifyPayment, isFetching: isVerifying } = useVerifySubscriptionPayment(
    activePaymentId,
    { enabled: false }
  );

  if (!isOpen || !pkg) return null;

  const handlePaymentSubmit = (source: MoyasarCreditCardSource) => {
    setErrorMessage(null);

    checkout(
      {
        package_id: pkg.id,
        source,
      },
      {
        onSuccess: (res) => {
          const { status, payment_id, transaction_url } = res.data;
          setActivePaymentId(payment_id);

          if (status === "paid" || status === "success") {
            setPaymentSuccess(true);
            toast.success("تم تفعيل اشتراكك بنجاح! مرحباً بك في مدارك");
            if (onSuccess) onSuccess();
          } else if (status === "initiated" && transaction_url) {
            setTransactionUrl(transaction_url);
            setIs3DSOpen(true);
          } else if (status === "failed") {
            setErrorMessage("لم تتم عملية الدفع بنجاح. يرجى التأكد من بيانات البطاقة والمحاولة مرة أخرى.");
          } else {
            // Default initiated without direct URL or other state
            setActivePaymentId(payment_id);
            setTransactionUrl(transaction_url || null);
            if (transaction_url) {
              setIs3DSOpen(true);
            }
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

  const handleVerify3DS = async () => {
    if (!activePaymentId) return;
    try {
      const res = await verifyPayment();
      if (res.data?.is_subscribed || res.data?.status === "paid" || res.data?.status === "success") {
        setIs3DSOpen(false);
        setPaymentSuccess(true);
        toast.success("تم التحقق وتأكيد اشتراكك بنجاح!");
        if (onSuccess) onSuccess();
      } else if (res.data?.status === "failed") {
        setIs3DSOpen(false);
        setErrorMessage("فشلت عملية التحقق من البطاقة. يرجى إعادة المحاولة.");
        toast.error("فشلت عملية الدفع من قبل البنك.");
      } else {
        toast("الدفعة قيد المعالجة، جاري الفحص...", { icon: "⏳" });
      }
    } catch {
      toast.error("تعذر التحقق من حالة الدفعة حالياً، يرجى المحاولة مجدداً.");
    }
  };

  const handleCloseAll = () => {
    setIs3DSOpen(false);
    setPaymentSuccess(false);
    setErrorMessage(null);
    setActivePaymentId(null);
    setTransactionUrl(null);
    onClose();
  };

  const effectivePrice = pkg.discountedPrice ?? pkg.price;
  const priceDisplay = effectivePrice ? `${effectivePrice} ${pkg.currency || "ر.س"}` : "";

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAll}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl z-10 my-8"
          >
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 sm:px-8 py-5 bg-gradient-to-r from-purple-50/70 to-white">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-mad-main/10 text-mad-main font-bold">
                  <Sparkles className="size-5" />
                </div>
                <div className="text-right">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    إتمام الاشتراك في {pkg.name}
                  </h2>
                  <p className="text-xs text-gray-500 font-normal">
                    خطوة واحدة تفصل طفلك عن عالم القراءة الممتع
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseAll}
                className="flex size-9 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
              {/* SUCCESS VIEW */}
              {paymentSuccess ? (
                <div className="text-center py-8 space-y-6">
                  <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 animate-bounce">
                    <CheckCircle2 className="size-10" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-gray-900">
                      تهانينا! تم تفعيل اشتراكك بنجاح
                    </h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                      أصبح بإمكانك وبإمكان أطفالك الآن الاستمتاع بجميع القصص والأنشطة التفاعلية المخصصة لفئاتهم العمرية.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseAll();
                        router.push("/stories");
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      تصفح القصص الآن
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseAll();
                        router.push("/subscription-status");
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all cursor-pointer"
                    >
                      عرض تفاصيل اشتراكي
                    </button>
                  </div>
                </div>
              ) : (
                <>
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

                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                      <span className="text-xs text-gray-500 font-medium">المبلغ الإجمالي</span>
                      <span className="text-xl font-extrabold text-mad-main">
                        {priceDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700 text-xs sm:text-sm font-medium"
                    >
                      <AlertCircle className="size-5 shrink-0 text-rose-500" />
                      <div className="flex-1">{errorMessage}</div>
                    </motion.div>
                  )}

                  {/* Payment Method Form */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-900">بيانات البطاقة البنكية</h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <ShieldCheck className="size-4 text-emerald-600" />
                        <span>Moyasar Gateway</span>
                      </div>
                    </div>

                    <CreditCardForm
                      onSubmit={handlePaymentSubmit}
                      isLoading={isCheckingOut || isVerifying}
                      submitButtonText="تأكيد ودفع الاشتراك"
                      amountText={priceDisplay}
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* 3D Secure Iframe Modal */}
      <Payment3DSecureModal
        isOpen={is3DSOpen}
        transactionUrl={transactionUrl}
        paymentId={activePaymentId}
        onClose={() => setIs3DSOpen(false)}
        onCompleteCheck={handleVerify3DS}
      />
    </>
  );
};

export default CheckoutModal;
