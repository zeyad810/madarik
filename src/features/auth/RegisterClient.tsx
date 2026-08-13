"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/features/auth/RegisterForm";
import Otp from "@/features/auth/Otp";
import { RegisterFormData } from "@/features/auth/validation";

export default function RegisterClient() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleRegisterSubmit = (data: RegisterFormData) => {
    if (data?.phone) {
      setPhoneNumber(data.phone);
    }
    setStep("otp");
  };

  const handleOtpSuccess = () => {
    router.replace("/");
  };

  const handleBackToRegister = () => {
    setStep("register");
  };

  return step === "register" ? (
    <RegisterForm
      defaultPhone={phoneNumber}
      onSubmitSuccess={handleRegisterSubmit}
    />
  ) : (
    <Otp
      phoneNumber={phoneNumber}
      onVerifySuccess={handleOtpSuccess}
      onBackToLogin={handleBackToRegister}
      onResendCode={() => console.log("Resending OTP code for phone:", phoneNumber)}
    />
  );
}
