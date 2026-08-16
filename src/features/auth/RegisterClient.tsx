"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/features/auth/RegisterForm";
import Otp from "@/features/auth/Otp";
import { RegisterFormData } from "@/features/auth/validation";
import { useVerifyRegisterOtp } from "@/features/auth/hooks/useVerifyRegisterOtp";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import { AUTH_TOKEN_KEY } from "@/lib/auth";

export default function RegisterClient() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyRegisterOtp({
    onSuccess: (data) => {
      if (data?.token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
      router.replace("/login");
    },
  });

  const handleRegisterSubmit = (data: RegisterFormData) => {
    if (data?.phone) {
      setPhoneNumber(data.phone);
    }
    setStep("otp");
  };

  const handleOtpVerify = (otpCode: string) => {
    verifyOtp({
      phone: phoneNumber,
      otp: otpCode,
    });
  };

  const handleBackToRegister = () => {
    setStep("register");
  };

  const errorMessage = verifyError
    ? extractAuthErrorMessage(verifyError, "رمز التحقق غير صحيح")
    : null;

  return step === "register" ? (
    <RegisterForm
      defaultPhone={phoneNumber}
      onSubmitSuccess={handleRegisterSubmit}
    />
  ) : (
    <Otp
      phoneNumber={phoneNumber}
      onVerifySuccess={handleOtpVerify}
      isLoading={isVerifying}
      errorMessage={errorMessage}
      onBackToLogin={handleBackToRegister}
      onResendCode={() => console.log("Resending OTP code for phone:", phoneNumber)}
    />
  );
}
