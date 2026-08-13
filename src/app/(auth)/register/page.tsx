"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SidePanle from "@/features/auth/SidePanle";
import RegisterForm from "@/features/auth/RegisterForm";
import Otp from "@/features/auth/Otp";
import { RegisterFormData } from "@/features/auth/validation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleRegisterSubmit = (data: RegisterFormData) => {
    setPhoneNumber(data.phone);
    setStep("otp");
  };

  const handleOtpSuccess = (_code: string) => {
    router.push("/");
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 bg-white" dir="rtl">
      <div className="w-full flex flex-col md:flex-row items-center justify-center lg:justify-between gap-8">
        <div className="w-full flex-1 flex items-center justify-center">
          {step === "register" ? (
            <RegisterForm onSubmitSuccess={handleRegisterSubmit} />
          ) : (
            <Otp
              phoneNumber={phoneNumber}
              onVerifySuccess={handleOtpSuccess}
              onResendCode={() => console.log("Resending OTP code...")}
            />
          )}
        </div>
        <SidePanle />
      </div>
    </main>
  );
}


