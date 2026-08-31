"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, CreditCard as CardIcon, Sparkles, CheckCircle2 } from "lucide-react";
import {
  creditCardFormSchema,
  CreditCardFormData,
  formatCardNumber,
  formatExpiryDate,
  detectCardType,
  parseExpiry,
} from "../validation";
import { MoyasarCreditCardSource } from "../types";

export interface CreditCardFormProps {
  onSubmit: (source: MoyasarCreditCardSource) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  amountText?: string;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "إتمام الدفع الآمن",
  amountText,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardFormSchema),
    defaultValues: {
      name: "",
      number: "",
      expiry: "",
      cvc: "",
    },
    mode: "onBlur",
  });

  const cardValues = watch();
  const cardType = useMemo(() => detectCardType(cardValues.number || ""), [cardValues.number]);

  const handleFormSubmit = (data: CreditCardFormData) => {
    const { month, year } = parseExpiry(data.expiry);
    const cleanedNumber = data.number.replace(/\s+/g, "");

    const source: MoyasarCreditCardSource = {
      type: "creditcard",
      name: data.name.trim(),
      number: cleanedNumber,
      month,
      year,
      cvc: data.cvc.trim(),
    };

    onSubmit(source);
  };

  const handleQuickFillTest = () => {
    setValue("name", "Test User", { shouldValidate: true });
    setValue("number", "4111 1111 1111 1111", { shouldValidate: true });
    setValue("expiry", "12/28", { shouldValidate: true });
    setValue("cvc", "123", { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 text-right" dir="rtl">
      {/* =========================================================================
          1. INTERACTIVE VIRTUAL CARD PREVIEW
         ========================================================================= */}
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-mad-main p-6 text-white shadow-xl shadow-mad-main/10 border border-white/10">
        {/* Background glow effects */}
        <div className="absolute -top-12 -right-12 size-36 rounded-full bg-mad-main/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 size-36 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-44">
          {/* Top Row: Chip + Card Brand Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-10 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 p-1 flex flex-col justify-between shadow-inner border border-amber-300/40">
                <div className="h-0.5 w-full bg-amber-600/40 rounded" />
                <div className="h-0.5 w-full bg-amber-600/40 rounded" />
                <div className="h-0.5 w-full bg-amber-600/40 rounded" />
              </div>
              <span className="text-[10px] font-medium tracking-wider text-slate-300 uppercase">
                الدفع الإلكتروني
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-white/15">
              {cardType === "mada" && <span className="text-emerald-300">مدى (mada)</span>}
              {cardType === "visa" && <span className="text-blue-300">VISA</span>}
              {cardType === "mastercard" && <span className="text-orange-300">Mastercard</span>}
              {cardType === "unknown" && <CardIcon className="size-4 text-slate-300" />}
            </div>
          </div>

          {/* Middle: Formatted Card Number */}
          <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-100 drop-shadow-sm text-left dir-ltr">
            {cardValues.number || "•••• •••• •••• ••••"}
          </div>

          {/* Bottom: Cardholder Name + Expiry */}
          <div className="flex items-end justify-between text-xs">
            <div className="space-y-0.5 max-w-[65%]">
              <span className="text-[10px] text-slate-300 uppercase block font-medium">
                حامل البطاقة
              </span>
              <p className="font-bold truncate text-slate-100">
                {cardValues.name || "الاسم كما هو مدون على البطاقة"}
              </p>
            </div>

            <div className="space-y-0.5 text-left dir-ltr">
              <span className="text-[10px] text-slate-300 uppercase block font-medium">
                EXPIRY
              </span>
              <p className="font-mono font-bold text-slate-100">
                {cardValues.expiry || "MM/YY"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. QUICK TEST FILL HELPER (For local & staging tests)
         ========================================================================= */}
      <div className="flex items-center justify-between bg-purple-50/70 border border-purple-100 rounded-xl px-3.5 py-2">
        <div className="flex items-center gap-2 text-xs text-mad-main font-medium">
          <Sparkles className="size-4 shrink-0 text-amber-500" />
          <span>تريد تجربة سريعة؟</span>
        </div>
        <button
          type="button"
          onClick={handleQuickFillTest}
          className="text-xs font-bold text-mad-main hover:text-mad-purple-800 underline cursor-pointer transition-colors"
        >
          تعبئة بطاقة اختبار ميسر
        </button>
      </div>

      {/* =========================================================================
          3. FORM INPUT FIELDS
         ========================================================================= */}
      <div className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
            اسم حامل البطاقة <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="مثال: محمد أحمد"
            disabled={isLoading}
            className={`w-full rounded-xl border bg-gray-50/60 px-4 py-3 text-sm text-gray-900 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                : "border-gray-200 focus:border-mad-main focus:ring-mad-main/20"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
            رقم البطاقة <span className="text-rose-500">*</span>
          </label>
          <Controller
            control={control}
            name="number"
            render={({ field }) => (
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  disabled={isLoading}
                  value={field.value}
                  onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                  onBlur={field.onBlur}
                  className={`w-full rounded-xl border bg-gray-50/60 px-4 py-3 pl-12 text-sm font-mono text-gray-900 transition-all focus:bg-white focus:outline-none focus:ring-2 text-left dir-ltr ${
                    errors.number
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                      : "border-gray-200 focus:border-mad-main focus:ring-mad-main/20"
                  }`}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  {cardType === "mada" ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      mada
                    </span>
                  ) : cardType === "visa" ? (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      VISA
                    </span>
                  ) : cardType === "mastercard" ? (
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                      MC
                    </span>
                  ) : (
                    <CardIcon className="size-5 text-gray-400" />
                  )}
                </div>
              </div>
            )}
          />
          {errors.number && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.number.message}</p>
          )}
        </div>

        {/* Expiry Date and CVC Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
              تاريخ الانتهاء <span className="text-rose-500">*</span>
            </label>
            <Controller
              control={control}
              name="expiry"
              render={({ field }) => (
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  disabled={isLoading}
                  value={field.value}
                  onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                  onBlur={field.onBlur}
                  className={`w-full rounded-xl border bg-gray-50/60 px-4 py-3 text-sm font-mono text-gray-900 transition-all focus:bg-white focus:outline-none focus:ring-2 text-center dir-ltr ${
                    errors.expiry
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                      : "border-gray-200 focus:border-mad-main focus:ring-mad-main/20"
                  }`}
                />
              )}
            />
            {errors.expiry && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.expiry.message}</p>
            )}
          </div>

          {/* CVC Code */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
              رمز الأمان (CVC) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register("cvc")}
                type="password"
                maxLength={4}
                inputMode="numeric"
                placeholder="•••"
                disabled={isLoading}
                className={`w-full rounded-xl border bg-gray-50/60 px-4 py-3 text-sm font-mono text-gray-900 transition-all focus:bg-white focus:outline-none focus:ring-2 text-center dir-ltr ${
                  errors.cvc
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                    : "border-gray-200 focus:border-mad-main focus:ring-mad-main/20"
                }`}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="size-3.5" />
              </div>
            </div>
            {errors.cvc && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.cvc.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. TRUST & SECURITY NOTICE
         ========================================================================= */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-1">
        <ShieldCheck className="size-4 text-emerald-600" />
        <span>دفع مشفر وآمن 100% متوافق مع معايير PCI-DSS عبر بوابة ميسر</span>
      </div>

      {/* =========================================================================
          5. SUBMIT BUTTON
         ========================================================================= */}
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.99 }}
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-mad-main px-6 py-4 text-sm font-bold text-white shadow-md shadow-mad-main/20 transition-all hover:bg-mad-purple-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>جاري معالجة الدفع بأمان...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span>{submitButtonText}</span>
            {amountText && (
              <span className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-extrabold text-white">
                {amountText}
              </span>
            )}
          </div>
        )}
      </motion.button>
    </form>
  );
};

export default CreditCardForm;
