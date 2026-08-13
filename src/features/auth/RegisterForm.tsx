"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema, RegisterFormData } from "./validation";
import { AUTH_TEXTS, AUTH_TYPOGRAPHY, AUTH_COLORS } from "./constants";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";

interface RegisterFormProps {
  onSubmitSuccess?: (data: RegisterFormData) => void;
  texts?: typeof AUTH_TEXTS.register;
  typography?: typeof AUTH_TYPOGRAPHY;
  colors?: typeof AUTH_COLORS;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmitSuccess,
  texts = AUTH_TEXTS.register,
  typography = AUTH_TYPOGRAPHY,
  colors = AUTH_COLORS,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const onSubmit = (data: RegisterFormData) => {
    if (onSubmitSuccess) {
      onSubmitSuccess(data);
    } else {
      console.log("Register Data:", data);
    }
  };

  return (
    <div className="w-full max-w-[440px] px-4 py-8 flex flex-col items-center justify-center font-sans" dir="rtl">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/logo- 1.png"
          alt={texts.logoAlt}
          width={140}
          height={140}
          className="w-auto h-28 object-contain"
          priority
        />
      </div>

      {/* Heading */}
      <h1 className={`${typography.heading} ${colors.heading} mb-8 text-center tracking-tight`}>
        {texts.heading}
      </h1>

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
          disabled={isSubmitting}
        />

        {/* Password Field */}
        <div className="flex flex-col gap-1.5 text-right">
          <label htmlFor="password" className={`${typography.label} ${colors.label}`}>
            {texts.passwordLabel} <span className={colors.required}>*</span>
          </label>
          <div className={`relative flex items-center border ${colors.inputBorder} rounded-2xl px-4 py-3.5 bg-white ${colors.inputFocusBorder} transition-all shadow-xs`}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={texts.passwordPlaceholder}
              {...register("password")}
              className={`w-full bg-transparent border-none outline-none ${typography.input} ${colors.inputText} ${colors.inputPlaceholder} tracking-widest font-sans`}
              dir="rtl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`${colors.eyeIcon} transition-colors pr-1 focus:outline-none cursor-pointer shrink-0`}
              aria-label={showPassword ? texts.hidePasswordLabel : texts.showPasswordLabel}
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className={`${typography.error} ${colors.errorText} mt-0.5`}>{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5 text-right">
          <label htmlFor="confirmPassword" className={`${typography.label} ${colors.label}`}>
            {texts.confirmPasswordLabel} <span className={colors.required}>*</span>
          </label>
          <div className={`relative flex items-center border ${colors.inputBorder} rounded-2xl px-4 py-3.5 bg-white ${colors.inputFocusBorder} transition-all shadow-xs`}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={texts.confirmPasswordPlaceholder}
              {...register("confirmPassword")}
              className={`w-full bg-transparent border-none outline-none ${typography.input} ${colors.inputText} ${colors.inputPlaceholder} tracking-widest font-sans`}
              dir="rtl"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`${colors.eyeIcon} transition-colors pr-1 focus:outline-none cursor-pointer shrink-0`}
              aria-label={showConfirmPassword ? texts.hidePasswordLabel : texts.showPasswordLabel}
            >
              {showConfirmPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className={`${typography.error} ${colors.errorText} mt-0.5`}>{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full mt-4 py-3.5 px-6 rounded-full ${colors.submitButton} ${typography.button} transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.99]`}
        >
          {isSubmitting ? texts.submittingButton : texts.submitButton}
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