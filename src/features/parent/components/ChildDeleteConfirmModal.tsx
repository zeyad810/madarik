"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { ManagedChild } from "../types";

interface ChildDeleteConfirmModalProps {
  isOpen: boolean;
  child: ManagedChild | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ChildDeleteConfirmModal: React.FC<ChildDeleteConfirmModalProps> = ({
  isOpen,
  child,
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

  if (!isOpen || !child) return null;

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

        {/* Delete Warning Icon & Header Badge */}
        <div className="flex flex-col items-center">
          <div className="size-18 rounded-full bg-red-50 border-4 border-red-100/80 flex items-center justify-center mb-3 text-red-600 shadow-inner">
            <Trash2 className="size-9 stroke-[2.2]" />
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-2">
            حذف حساب الطفل نهائياً
          </span>
        </div>

        {/* Modal Title */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2 mb-2">
          هل أنت متأكد من حذف حساب {child.name}؟
        </h3>

        {/* Child Summary Box */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100/80 my-4 text-right">
          <div className="size-12 rounded-full overflow-hidden p-0.5 ring-2 ring-purple-100 bg-purple-50 shrink-0">
            <Image
              src={child.avatar || (child.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png")}
              alt={child.name}
              width={48}
              height={48}
              className="size-full object-cover rounded-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm truncate">{child.name}</p>
            {child.ageCategory && (
              <p className="text-xs text-gray-500">الفئة: {child.ageCategory}</p>
            )}
          </div>
        </div>

        {/* Informational Warning Message */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-red-50/70 border border-red-100 text-right mb-6">
          <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
            تحذير: هذا الإجراء نهائي ولا يمكن التراجع عنه. سيتم حذف جميع بيانات الطفل وسجل قراءاته والأوسمة الخاصة به بشكل دائم.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100/70 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50"
          >
            إلغاء
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
                <span>جاري الحذف...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-4 stroke-[2.2]" />
                <span>نعم، حذف الحساب</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildDeleteConfirmModal;
