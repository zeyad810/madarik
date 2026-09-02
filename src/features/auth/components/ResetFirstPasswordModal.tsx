"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, LogOut, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { signOut } from "next-auth/react";
import { resetFirstPasswordSchema, ResetFirstPasswordFormData } from "../validation";
import { useResetFirstPassword } from "../hooks/useResetFirstPassword";
import { AUTH_TEXTS, AUTH_TYPOGRAPHY, AUTH_COLORS } from "../constants";
import { clearStoredAuth } from "@/lib/auth";

interface ResetFirstPasswordModalProps {
  isOpen: boolean;
  onSuccess?: () => void;
  onSignOut?: () => void;
}

export const ResetFirstPasswordModal: React.FC<ResetFirstPasswordModalProps> = ({
  isOpen,
  onSuccess,
  onSignOut,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const texts = AUTH_TEXTS.resetFirstPassword;
  const typography = AUTH_TYPOGRAPHY;
  const colors = AUTH_COLORS;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetFirstPasswordFormData>({
    resolver: zodResolver(resetFirstPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: executeReset, isPending } = useResetFirstPassword({
    onSuccess: () => {
      reset();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const onSubmit = (data: ResetFirstPasswordFormData) => {
    executeReset({
      password: data.password,
      password_confirmation: data.confirmPassword,
      new_password: data.password,
      new_password_confirmation: data.confirmPassword,
    });
  };

  const handleLogout = async () => {
    clearStoredAuth();
    if (onSignOut) {
      onSignOut();
    }
    await signOut({ callbackUrl: "/login" });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-title"
      dir="rtl"
    >
      <div className="relative w-full max-w-[460px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {/* Header Icon */}
        <div className="size-16 rounded-2xl bg-purple-50 text-mad-main flex items-center justify-center mb-4 ring-8 ring-purple-50/50 shadow-inner">
          <KeyRound className="size-8 stroke-[2.2]" />
        </div>

        {/* Title & Description */}
        <h2
          id="reset-password-title"
          className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2"
        >
          {texts.heading}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
          {texts.description}
        </p>

        {/* Security Notice */}
        <div className="w-full mb-6 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-2.5 text-right">
          <ShieldAlert className="size-5 text-amber-600 shrink-0" />
          <span className="text-xs font-semibold text-amber-800 leading-normal">
            لأمان حسابك، يجب إنشاء كلمة مرور جديدة قبل الدخول إلى النظام.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 text-right">
          {/* New Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="first-password-input"
              className={`${typography.label} ${colors.label}`}
            >
              {texts.passwordLabel} <span className={colors.required}>*</span>
            </label>
            <div
              className={`relative flex items-center border ${colors.inputBorder} rounded-2xl px-4 py-3.5 bg-white ${colors.inputFocusBorder} transition-all shadow-xs`}
            >
              <input
                id="first-password-input"
                type={showPassword ? "text" : "password"}
                placeholder={texts.passwordPlaceholder}
                {...register("password")}
                disabled={isPending}
                className={`w-full bg-transparent border-none outline-none ${typography.input} ${colors.inputText} ${colors.inputPlaceholder} tracking-widest font-sans`}
                dir="rtl"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPending}
                className={`${colors.eyeIcon} transition-colors pr-1 focus:outline-none cursor-pointer shrink-0`}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <span className={`${typography.error} ${colors.errorText} mt-0.5`}>
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="first-confirm-password-input"
              className={`${typography.label} ${colors.label}`}
            >
              {texts.confirmPasswordLabel} <span className={colors.required}>*</span>
            </label>
            <div
              className={`relative flex items-center border ${colors.inputBorder} rounded-2xl px-4 py-3.5 bg-white ${colors.inputFocusBorder} transition-all shadow-xs`}
            >
              <input
                id="first-confirm-password-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={texts.confirmPasswordPlaceholder}
                {...register("confirmPassword")}
                disabled={isPending}
                className={`w-full bg-transparent border-none outline-none ${typography.input} ${colors.inputText} ${colors.inputPlaceholder} tracking-widest font-sans`}
                dir="rtl"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isPending}
                className={`${colors.eyeIcon} transition-colors pr-1 focus:outline-none cursor-pointer shrink-0`}
                aria-label={
                  showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
              >
                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={`${typography.error} ${colors.errorText} mt-0.5`}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full !mt-6 py-3.5 px-6 rounded-full ${colors.submitButton} ${typography.button} flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.99]`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{texts.submittingButton}</span>
              </>
            ) : (
              texts.submitButton
            )}
          </button>
        </form>

        {/* Sign Out / Logout Option */}
        <div className="mt-5 pt-3 border-t border-gray-100 w-full flex justify-center">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <LogOut className="size-3.5" />
            <span>{texts.logoutText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetFirstPasswordModal;
