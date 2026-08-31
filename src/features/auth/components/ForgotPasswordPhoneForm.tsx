"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  forgotPasswordPhoneSchema,
  ForgotPasswordPhoneFormData,
} from "../validation";
import { AUTH_TEXTS, AUTH_TYPOGRAPHY, AUTH_COLORS } from "../constants";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { ForgotPasswordResponse } from "@/types/auth";
import AuthHeader from "./AuthHeader";
import AuthErrorAlert from "./AuthErrorAlert";
import { extractAuthErrorMessage } from "../helpers/formatAuthError";

interface ForgotPasswordPhoneFormProps {
  onSubmitSuccess?: (
    data: ForgotPasswordPhoneFormData,
    response?: ForgotPasswordResponse
  ) => void;
  defaultPhone?: string;
  texts?: typeof AUTH_TEXTS.forgotPasswordFlow;
  typography?: typeof AUTH_TYPOGRAPHY;
  colors?: typeof AUTH_COLORS;
}

export const ForgotPasswordPhoneForm: React.FC<ForgotPasswordPhoneFormProps> = ({
  onSubmitSuccess,
  defaultPhone = "",
  texts = AUTH_TEXTS.forgotPasswordFlow,
  typography = AUTH_TYPOGRAPHY,
  colors = AUTH_COLORS,
}) => {
  const {
    mutate: executeForgotPassword,
    isPending,
    error: mutationError,
  } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordPhoneFormData>({
    resolver: zodResolver(forgotPasswordPhoneSchema),
    defaultValues: {
      phone: defaultPhone,
    },
  });

  const isLoading = isSubmitting || isPending;

  const onSubmit = (data: ForgotPasswordPhoneFormData) => {
    console.log("[Forgot Password Phone Form Submitted]:", data);
    executeForgotPassword(
      {
        phone: data.phone.trim(),
      },
      {
        onSuccess: (response) => {
          if (onSubmitSuccess) {
            onSubmitSuccess(
              {
                phone: data.phone.trim(),
              },
              response
            );
          }
        },
      }
    );
  };

  const apiErrorMessage = mutationError
    ? extractAuthErrorMessage(mutationError, "حدث خطأ أثناء إرسال رمز التحقق")
    : null;

  return (
    <div
      className="w-full max-w-[440px] px-4 py-8 flex flex-col items-center justify-center font-sans"
      dir="rtl"
    >
      {/* Shared Auth Header */}
      <AuthHeader
        logoAlt={texts.logoAlt}
        heading={texts.phoneStepHeading}
        description={texts.phoneStepDescription}
        typographyHeading={typography.heading}
        colorsHeading={colors.heading}
      />

      {/* API Error Alert */}
      <AuthErrorAlert message={apiErrorMessage} />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* Phone Field using PhoneNumberInput */}
        <PhoneNumberInput
          name="phone"
          control={control}
          label={texts.phoneLabel}
          placeholder={texts.phonePlaceholder}
          required
          defaultCountry="SA"
          disabled={isLoading}
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
              <span>{texts.submittingPhoneButton}</span>
            </>
          ) : (
            texts.submitPhoneButton
          )}
        </button>

        {/* Footer Login Link */}
        <div className={`text-center pt-2 ${typography.footer} ${colors.footerText}`}>
          <span>{texts.rememberPassword}</span>
          <Link
            href="/login"
            className={`font-bold ${colors.footerLink} underline transition-colors`}
          >
            {texts.loginLink}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPhoneForm;
