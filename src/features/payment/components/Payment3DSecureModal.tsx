"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ShieldCheck, RefreshCw } from "lucide-react";

export interface Payment3DSecureModalProps {
  isOpen: boolean;
  transactionUrl: string | null;
  paymentId: string | null;
  onClose: () => void;
  onCompleteCheck: () => void;
}

export const Payment3DSecureModal: React.FC<Payment3DSecureModalProps> = ({
  isOpen,
  transactionUrl,
  paymentId,
  onClose,
  onCompleteCheck,
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!isOpen || !transactionUrl) return null;

  const handleOpenExternal = () => {
    window.open(transactionUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/70">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <ShieldCheck className="size-4" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-gray-900">التحقق الأمني للبطاقة (3D Secure)</h3>
                <p className="text-[11px] text-gray-500">يرجى تأكيد العملية عبر إدخال رمز التحقق المرسل من البنك</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenExternal}
                title="فتح في نافذة خارجية"
                className="flex size-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-mad-main hover:border-mad-main transition-colors cursor-pointer"
              >
                <ExternalLink className="size-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="relative flex-1 min-h-[440px] bg-gray-50">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 z-10">
                <div className="size-8 border-3 border-mad-main/30 border-t-mad-main rounded-full animate-spin" />
                <p className="text-xs text-gray-500 font-medium">جاري تحميل صفحة التحقق البنكي...</p>
              </div>
            )}
            <iframe
              src={transactionUrl}
              onLoad={() => setIframeLoading(false)}
              className="w-full h-full min-h-[440px] border-0"
              title="3D Secure Verification"
              allow="payment"
            />
          </div>

          {/* Footer Bar */}
          <div className="border-t border-gray-100 px-6 py-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              بعد إتمام إدخال الرمز من بنكك، اضغط على الزر أدناه لتأكيد الاشتراك
            </span>
            <button
              type="button"
              onClick={onCompleteCheck}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <RefreshCw className="size-3.5" />
              <span>تحقق من نجاح الدفع الآن</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Payment3DSecureModal;
