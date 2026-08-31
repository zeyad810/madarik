"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordPhoneForm from "./components/ForgotPasswordPhoneForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import Otp from "./Otp";
import { useForgotPassword } from "./hooks/useForgotPassword";
import { ForgotPasswordPhoneFormData } from "./validation";
import { ForgotPasswordResponse } from "@/types/auth";
import { extractAuthErrorMessage } from "./helpers/formatAuthError";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp" | "password">("phone");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const {
    mutate: resendOtp,
    isPending: isResending,
    error: resendError,
  } = useForgotPassword({
    onSuccess: (data) => {
      if (data?.dev_otp) {
        setDevOtp(data.dev_otp);
      }
      setOtpError(null);
    },
  });

  const handlePhoneSubmit = (
    data: ForgotPasswordPhoneFormData,
    response?: ForgotPasswordResponse
  ) => {
    if (data?.phone) {
      setPhoneNumber(data.phone.trim());
    }
    if (response?.dev_otp) {
      setDevOtp(response.dev_otp);
    }
    setOtpError(null);
    setStep("otp");
  };

  const handleOtpVerify = (code: string) => {
    const trimmedCode = code.trim();

    // Check if dev_otp is provided and validate against it
    if (devOtp && trimmedCode !== devOtp.trim()) {
      setOtpError("كود التحقق غير صحيح. يرجى إدخال الرمز الصحيح والمحاولة مرة أخرى.");
      return;
    }

    setOtpError(null);
    setOtpCode(trimmedCode);
    setStep("password");
  };

  const handleBackToPhone = () => {
    setOtpError(null);
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

  const displayedOtpError = otpError || resendErrorMessage;

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
        errorMessage={displayedOtpError}
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
