"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  resetPasswordConfirmSchema,
  ResetPasswordConfirmFormData,
} from "../validation";
import { AUTH_TEXTS, AUTH_TYPOGRAPHY, AUTH_COLORS } from "../constants";
import { useResetPassword } from "../hooks/useResetPassword";
import { ResetPasswordResponse } from "@/types/auth";
import AuthHeader from "./AuthHeader";
import AuthErrorAlert from "./AuthErrorAlert";
import PasswordField from "./PasswordField";
import { extractAuthErrorMessage } from "../helpers/formatAuthError";

interface ResetPasswordFormProps {
  phone: string;
  code: string;
  onSubmitSuccess?: (
    data: ResetPasswordConfirmFormData,
    response?: ResetPasswordResponse
  ) => void;
  onBackToOtp?: () => void;
  texts?: typeof AUTH_TEXTS.forgotPasswordFlow;
  typography?: typeof AUTH_TYPOGRAPHY;
  colors?: typeof AUTH_COLORS;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  phone,
  code,
  onSubmitSuccess,
  onBackToOtp,
  texts = AUTH_TEXTS.forgotPasswordFlow,
  typography = AUTH_TYPOGRAPHY,
  colors = AUTH_COLORS,
}) => {
  const {
    mutate: executeResetPassword,
    isPending,
    error: mutationError,
  } = useResetPassword({
    onSuccess: (response, variables) => {
      if (onSubmitSuccess) {
        onSubmitSuccess(
          {
            password: variables.password,
            confirmPassword: variables.password,
          },
          response
        );
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordConfirmFormData>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = isSubmitting || isPending;

  const onSubmit = (data: ResetPasswordConfirmFormData) => {
    console.log("[Reset Password Form Submitted]:", data);
    executeResetPassword({
      phone: phone.trim(),
      code: code.trim(),
      password: data.password,
      password_confirmation: data.confirmPassword,
    });
  };

  const apiErrorMessage = mutationError
    ? extractAuthErrorMessage(mutationError, "حدث خطأ أثناء إعادة تعيين كلمة المرور")
    : null;

  return (
    <div
      className="w-full max-w-[440px] px-4 py-8 flex flex-col items-center justify-center font-sans"
      dir="rtl"
    >
      {/* Shared Auth Header */}
      <AuthHeader
        logoAlt={texts.logoAlt}
        heading={texts.newPasswordHeading}
        description={texts.newPasswordDescription}
        typographyHeading={typography.heading}
        colorsHeading={colors.heading}
      />

      {/* API Error Alert */}
      <AuthErrorAlert message={apiErrorMessage} />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* Password Field */}
        <PasswordField
          id="new-password"
          label={texts.passwordLabel}
          placeholder={texts.passwordPlaceholder}
          register={register("password")}
          error={errors.password?.message}
          disabled={isLoading}
          typography={typography}
          colors={colors}
          hidePasswordLabel={texts.hidePasswordLabel}
          showPasswordLabel={texts.showPasswordLabel}
        />

        {/* Confirm Password Field */}
        <PasswordField
          id="confirm-password"
          label={texts.confirmPasswordLabel}
          placeholder={texts.confirmPasswordPlaceholder}
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          typography={typography}
          colors={colors}
          hidePasswordLabel={texts.hidePasswordLabel}
          showPasswordLabel={texts.showPasswordLabel}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-4 py-3.5 px-6 rounded-full ${colors.submitButton} ${typography.button} flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.99]`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{texts.submittingNewPasswordButton}</span>
            </>
          ) : (
            texts.submitNewPasswordButton
          )}
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-2 text-sm font-medium">
          {onBackToOtp && (
            <button
              type="button"
              onClick={onBackToOtp}
              disabled={isLoading}
              className="text-[#667085] hover:text-[#101828] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              العودة لإدخال الرمز
            </button>
          )}

          <Link
            href="/login"
            className="text-mad-purple-600 hover:text-mad-main font-semibold mr-auto transition-colors"
          >
            {texts.backToLogin}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
