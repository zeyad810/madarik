"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/features/auth/LoginForm";
import Otp from "@/features/auth/Otp";
import { LoginFormData } from "@/features/auth/validation";

export default function LoginClient() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "otp">("login");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleLoginSuccess = (data: LoginFormData) => {
    if (data?.phone) {
      setPhoneNumber(data.phone);
    }
    setStep("otp");
  };

  const handleOtpSuccess = () => {
    router.replace("/");
  };

  const handleBackToLogin = () => {
    setStep("login");
  };

  return step === "login" ? (
    <LoginForm
      defaultPhone={phoneNumber}
      onSubmitSuccess={handleLoginSuccess}
    />
  ) : (
    <Otp
      phoneNumber={phoneNumber}
      onVerifySuccess={handleOtpSuccess}
      onBackToLogin={handleBackToLogin}
      onResendCode={() => console.log("Resending OTP code for phone:", phoneNumber)}
    />
  );
}
