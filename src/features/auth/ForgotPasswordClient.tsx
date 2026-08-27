"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordPhoneForm from "./components/ForgotPasswordPhoneForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import Otp from "./Otp";
import { useForgotPassword } from "./hooks/useForgotPassword";
import { ForgotPasswordPhoneFormData } from "./validation";
import { extractAuthErrorMessage } from "./helpers/formatAuthError";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp" | "password">("phone");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");

  const {
    mutate: resendOtp,
    isPending: isResending,
    error: resendError,
  } = useForgotPassword();

  const handlePhoneSubmit = (data: ForgotPasswordPhoneFormData) => {
    if (data?.phone) {
      setPhoneNumber(data.phone.trim());
    }
    setStep("otp");
  };

  const handleOtpVerify = (code: string) => {
    setOtpCode(code.trim());
    setStep("password");
  };

  const handleBackToPhone = () => {
    setStep("phone");
  };

  const handleBackToOtp = () => {
    setStep("otp");
  };

  const handleResend = () => {
    if (phoneNumber) {
      resendOtp({ phone: phoneNumber });
    }
  };

  const handleResetSuccess = () => {
    router.push("/login");
  };

  const resendErrorMessage = resendError
    ? extractAuthErrorMessage(resendError, "فشل في إعادة إرسال رمز التحقق")
    : null;

  if (step === "phone") {
    return (
      <ForgotPasswordPhoneForm
        defaultPhone={phoneNumber}
        onSubmitSuccess={handlePhoneSubmit}
      />
    );
  }

  if (step === "otp") {
    return (
      <Otp
        phoneNumber={phoneNumber}
        onVerifySuccess={handleOtpVerify}
        isLoading={isResending}
        errorMessage={resendErrorMessage}
        onBackToLogin={handleBackToPhone}
        onResendCode={handleResend}
      />
    );
  }

  return (
    <ResetPasswordForm
      phone={phoneNumber}
      code={otpCode}
      onSubmitSuccess={handleResetSuccess}
      onBackToOtp={handleBackToOtp}
    />
  );
}
