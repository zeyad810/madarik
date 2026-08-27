"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PauseCircle, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useFreezeSubscription } from "../hooks/usePackages";

interface FreezeSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanName?: string;
}

export const FreezeSubscriptionModal: React.FC<FreezeSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlanName = "الباقة المتقدمة",
}) => {
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [reason, setReason] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const freezeMutation = useFreezeSubscription();

  const handleConfirm = () => {
    freezeMutation.mutate(
      { durationMonths, reason },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
          }, 1800);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-gray-100 text-right overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </button>

          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="size-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                تم تجميد الباقة بنجاح
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                تم إيقاف اشتراكك مؤقتاً لمدة {durationMonths} شهر، وسيعود تلقائياً بعد انتهاء المدة.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <PauseCircle className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    تجميد اشتراك ({currentPlanName})
                  </h3>
                  <p className="text-xs text-gray-500">
                    يمكنك إيقاف الاشتراك مؤقتاً واستئنافه لاحقاً
                  </p>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5">
                <AlertCircle className="size-4.5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  خلال فترة التجميد، لن يتم خصم رسوم التجديد، وسيتم إيقاف وصول الأطفال للقصص المميزة حتى نهاية فترة التجميد.
                </p>
              </div>

              {/* Select Duration */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  اختر مدة التجميد:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setDurationMonths(months)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                        durationMonths === months
                          ? "bg-mad-main text-white border-mad-main shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {months} {months === 1 ? "شهر" : "أشهر"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Reason */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  سبب التجميد (اختياري):
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="مثال: سفر، إجازة مدرسية..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-mad-main focus:outline-hidden focus:ring-1 focus:ring-mad-main"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={freezeMutation.isPending}
                  onClick={handleConfirm}
                  className="flex-1 py-3 px-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {freezeMutation.isPending ? "جاري التجميد..." : "تأكيد التجميد"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FreezeSubscriptionModal;
