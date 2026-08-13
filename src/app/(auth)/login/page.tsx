"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SidePanle from "@/features/auth/SidePanle";
import LoginForm from "@/features/auth/LoginForm";
import Otp from "@/features/auth/Otp";
import { LoginFormData } from "@/features/auth/validation";

export default function LoginPage() {
  const router = useRouter();
  const [step] = useState<"login" | "otp">("login");
  const [phoneNumber] = useState<string>("");

  const handleLoginSubmit = (_data: LoginFormData) => {
    router.push("/");
    router.refresh();
  };

  const handleOtpSuccess = (_code: string) => {
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 bg-white" dir="rtl">
      <div className="w-full flex flex-col md:flex-row items-center justify-center lg:justify-between gap-8">
        <div className="w-full flex-1 flex items-center justify-center">
          {step === "login" ? (
            <LoginForm onSubmitSuccess={handleLoginSubmit} />
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
