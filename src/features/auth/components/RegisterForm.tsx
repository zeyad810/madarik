"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { registerSchema, RegisterFormData } from "../validation";
import { AUTH_TEXTS, AUTH_TYPOGRAPHY, AUTH_COLORS } from "../constants";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useRegister } from "../hooks/useRegister";
import { RegisterResponse } from "@/types/auth";
import AuthHeader from "./AuthHeader";
import AuthErrorAlert from "./AuthErrorAlert";
import PasswordField from "./PasswordField";
import { extractAuthErrorMessage } from "../helpers/formatAuthError";

interface RegisterFormProps {
  onSubmitSuccess?: (data: RegisterFormData, response?: RegisterResponse) => void;
  texts?: typeof AUTH_TEXTS.register;
  typography?: typeof AUTH_TYPOGRAPHY;
  colors?: typeof AUTH_COLORS;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmitSuccess,
  texts = AUTH_TEXTS.register,
  typography = AUTH_TYPOGRAPHY,
  colors = AUTH_COLORS,
}) => {
  const {
    mutate: executeRegister,
    isPending,
    error: mutationError,
  } = useRegister({
    onSuccess: (response, variables) => {
      if (onSubmitSuccess) {
        onSubmitSuccess(
          {
            username: variables.name,
            phone: variables.phone,
            password: variables.password,
            confirmPassword: variables.password,
          },
          response
        );
      }
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = isSubmitting || isPending;

  const onSubmit = (data: RegisterFormData) => {
    executeRegister({
      name: data.username.trim(),
      phone: data.phone.trim(),
      password: data.password,
    });
  };

  const apiErrorMessage = mutationError
    ? extractAuthErrorMessage(mutationError, "حدث خطأ عند إنشاء الحساب")
    : null;

  return (
    <div className="w-full max-w-[440px] px-4 py-8 flex flex-col items-center justify-center font-sans" dir="rtl">
      {/* Shared Auth Header */}
      <AuthHeader
        logoAlt={texts.logoAlt}
        heading={texts.heading}
        typographyHeading={typography.heading}
        colorsHeading={colors.heading}
      />

      {/* API Error Alert */}
      <AuthErrorAlert message={apiErrorMessage} />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* Username Field */}
        <div className="flex flex-col gap-1.5 text-right">
          <label htmlFor="username" className={`${typography.label} ${colors.label}`}>
            {texts.usernameLabel} <span className={colors.required}>*</span>
          </label>
          <div className={`relative flex items-center border ${colors.inputBorder} rounded-2xl px-4 py-3.5 bg-white ${colors.inputFocusBorder} transition-all shadow-xs`}>
            <input
              id="username"
              type="text"
              placeholder={texts.usernamePlaceholder}
              {...register("username")}
              disabled={isLoading}
              className={`w-full bg-transparent border-none outline-none ${typography.input} ${colors.inputText} ${colors.inputPlaceholder}`}
            />
          </div>
          {errors.username && (
            <span className={`${typography.error} ${colors.errorText} mt-0.5`}>{errors.username.message}</span>
          )}
        </div>

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

        {/* Password Field */}
        <PasswordField
          id="password"
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
          id="confirmPassword"
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
              <span>{texts.submittingButton}</span>
            </>
          ) : (
            texts.submitButton
          )}
        </button>

        {/* Footer Login Link */}
        <div className={`text-center pt-2 ${typography.footer} ${colors.footerText}`}>
          <span>{texts.hasAccount}</span>
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

export default RegisterForm;
