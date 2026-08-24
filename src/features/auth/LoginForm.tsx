"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { loginSchema, LoginFormData } from "./validation";
import { AUTH_TEXTS, AUTH_TYPOGRAPHY, AUTH_COLORS } from "./constants";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";

import { useSession } from "next-auth/react";
import LoginSwitcher from "./LoginSwitcher";
import { isStudentRole } from "@/lib/roles";

interface LoginFormProps {
  onSubmitSuccess?: (data: LoginFormData) => void;
  defaultPhone?: string;
  texts?: typeof AUTH_TEXTS.login;
  typography?: typeof AUTH_TYPOGRAPHY;
  colors?: typeof AUTH_COLORS;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmitSuccess,
  defaultPhone = "",
  texts = AUTH_TEXTS.login,
  typography = AUTH_TYPOGRAPHY,
  colors = AUTH_COLORS,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const sessionUserType = (session as any)?.user_type || (session?.user as any)?.user_type;
  const isStudent = isStudentRole(sessionUserType);

  // If already authenticated as student, redirect immediately
  React.useEffect(() => {
    if (status === "authenticated" && isStudent) {
      const callbackUrl = searchParams?.get("callbackUrl");
      const targetUrl = callbackUrl || "/stories";
      router.push(targetUrl);
      router.refresh();
    }
  }, [status, isStudent, router, searchParams]);

  const isSwitcherVisible = (showSwitcher || status === "authenticated") && !isStudent;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: defaultPhone,
      password: "",
    },
  });

  const isLoading = isSubmitting;

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);

    try {
      const res = await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setApiError(res.error);
        toast.error(res.error);
        return;
      }

      if (res?.ok) {
        toast.success("تم تسجيل الدخول بنجاح");
        if (onSubmitSuccess) {
          onSubmitSuccess(data);
        }

        const currentSession = await getSession();
        const rawRole = (currentSession as any)?.user_type || (currentSession?.user as any)?.user_type;
        if (isStudentRole(rawRole)) {
          const callbackUrl = searchParams?.get("callbackUrl");
          const targetUrl = callbackUrl || "/stories";
          router.push(targetUrl);
          router.refresh();
          return;
        }

        setShowSwitcher(true);
      }
    } catch {
      const errorMsg = "حدث خطأ غير متوقع عند تسجيل الدخول";
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (status === "authenticated" && isStudent) {
    return (
      <div className="w-full max-w-[440px] px-4 py-12 flex flex-col items-center justify-center font-sans">
        <Loader2 className="size-8 animate-spin text-mad-main mb-4" />
        <span className="text-sm font-semibold text-gray-500">جاري توجيهك إلى صفحة القصص...</span>
      </div>
    );
  }

  if (isSwitcherVisible) {
    return (
      <LoginSwitcher
        onSwitchUser={() => setShowSwitcher(false)}
        onComplete={() => {
          const callbackUrl = searchParams?.get("callbackUrl");
          const targetUrl = callbackUrl || "/";
          router.push(targetUrl);
          router.refresh();
        }}
      />
    );
  }

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

      {/* API General Error Alert */}
      {apiError && (
        <div className="w-full mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-right">
          {apiError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* Phone Field using PhoneNumberInput Component */}
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
              disabled={isLoading}
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

          {/* Forgot Password Link */}
          <div className="text-left mt-1">
            <Link
              href="/forgot-password"
              className={`${typography.forgotPassword} ${colors.forgotPassword} transition-colors`}
            >
              {texts.forgotPassword}
            </Link>
          </div>
        </div>

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

        {/* Footer Register Link */}
        <div className={`text-center pt-2 ${typography.footer} ${colors.footerText}`}>
          <span>{texts.noAccount}</span>
          <Link
            href="/register"
            className={`font-bold ${colors.footerLink} underline transition-colors`}
          >
            {texts.createAccount}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
