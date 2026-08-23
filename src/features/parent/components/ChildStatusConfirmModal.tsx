"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, X, Loader2 } from "lucide-react";
import { ManagedChild } from "../types";

interface ChildStatusConfirmModalProps {
  isOpen: boolean;
  child: ManagedChild | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ChildStatusConfirmModal: React.FC<ChildStatusConfirmModalProps> = ({
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

  // If child is currently active, next action is deactivation (Warning/Amber)
  // If child is currently inactive, next action is activation (Green/Positive)
  const isCurrentlyActive = child.status === "active";
  const isDeactivating = isCurrentlyActive;

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
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 text-center z-10 animate-in zoom-in-95 duration-200 select-none">
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

        {/* Status Icon & Header Badge */}
        {isDeactivating ? (
          <div className="flex flex-col items-center">
            <div className="size-18 rounded-full bg-amber-50 border-4 border-amber-100/80 flex items-center justify-center mb-3 text-amber-500 shadow-inner">
              <AlertTriangle className="size-9 stroke-[2.2]" />
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
              تنبيه تعطيل الحساب
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="size-18 rounded-full bg-emerald-50 border-4 border-emerald-100/80 flex items-center justify-center mb-3 text-emerald-500 shadow-inner">
              <CheckCircle2 className="size-9 stroke-[2.2]" />
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              تفعيل حساب الطفل
            </span>
          </div>
        )}

        {/* Modal Title */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2 mb-2">
          {isDeactivating
            ? `هل أنت متأكد من تعطيل حساب ${child.name}؟`
            : `هل أنت متأكد من تفعيل حساب ${child.name}؟`}
        </h3>

        {/* Child Summary Box */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100/80 my-4 text-right">
          <div className="size-12 rounded-full overflow-hidden p-0.5 ring-2 ring-purple-100 bg-purple-50 shrink-0">
            <Image
              src={child.avatar}
              alt={child.name}
              width={48}
              height={48}
              className="size-full object-cover rounded-full"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm truncate">{child.name}</p>
            <p className="text-xs text-gray-500">الفئة: {child.ageCategory}</p>
          </div>
          <div
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${isCurrentlyActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-200 text-gray-600"
              }`}
          >
            {isCurrentlyActive ? "مفعل حالياً" : "معطل حالياً"}
          </div>
        </div>

        {/* Informational Message */}
        <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mb-6">
          {isDeactivating
            ? "عند تعطيل الحساب، لن يتمكن الطفل من تسجيل الدخول أو إكمال القصص والاختبارات حتى تقوم بإعادة تفعيله مرة أخرى."
            : "سيتمكن الطفل من تسجيل الدخول فوراً ومتابعة رحلته القرائية وحل الاختبارات وكسب الأوسمة."}
        </p>

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

          {isDeactivating ? (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>جاري التعطيل...</span>
                </>
              ) : (
                <span>نعم، تعطيل الحساب</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>جاري التفعيل...</span>
                </>
              ) : (
                <span>نعم، تفعيل الحساب</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildStatusConfirmModal;
