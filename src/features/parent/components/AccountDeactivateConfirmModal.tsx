"use client";

import React, { useEffect } from "react";
import { AlertTriangle, X, Loader2, UserX } from "lucide-react";

interface AccountDeactivateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const AccountDeactivateConfirmModal: React.FC<AccountDeactivateConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* 1. Backdrop */}
      <div
        onClick={() => {
          if (!isLoading) onClose();
        }}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* 2. Modal Content Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-100 text-center z-10 animate-in zoom-in-95 duration-200 select-none">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="إغلاق"
        >
          <X className="size-5" />
        </button>

        {/* Warning Icon & Header Badge */}
        <div className="flex flex-col items-center">
          <div className="size-18 rounded-full bg-red-50 border-4 border-red-100/80 flex items-center justify-center mb-3 text-red-600 shadow-inner">
            <UserX className="size-9 stroke-[2.2]" />
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-2">
            حذف / تعطيل الحساب
          </span>
        </div>

        {/* Modal Title */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2 mb-2">
          هل أنت متأكد من رغبتك في حذف الحساب؟
        </h3>

        {/* Informational Message */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-right my-4">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-800 font-medium leading-relaxed">
            سيتم تعطيل حسابك وتسجيل خروجك تلقائياً من المنصة وحذف بيانات الجلسة. لن تتمكن من الوصول إلى خدمات المنصة حتى تتم إعادة تنشيط الحساب.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100/70 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50"
          >
            إلغاء والتراجع
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>جاري التعطيل وتسجيل الخروج...</span>
              </>
            ) : (
              <span>نعم، حذف الحساب</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDeactivateConfirmModal;
