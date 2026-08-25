"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import RegisterForm from "@/features/auth/RegisterForm";
import Otp from "@/features/auth/Otp";
import { RegisterFormData } from "@/features/auth/validation";
import { useVerifyRegisterOtp } from "@/features/auth/hooks/useVerifyRegisterOtp";
import { extractAuthErrorMessage } from "@/features/auth/helpers/formatAuthError";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { useActiveAccount } from "@/hooks/useActiveAccount";

export default function RegisterClient() {
  const router = useRouter();
  const { switchAccount } = useActiveAccount();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyRegisterOtp({
    onSuccess: async (data) => {
      if (data?.token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("accessToken", data.token);
      }

      setIsSigningIn(true);
      try {
        if (password && phoneNumber) {
          const res = await signIn("credentials", {
            phone: phoneNumber,
            password: password,
            redirect: false,
          });

          if (res?.ok) {
            switchAccount("parent");
            router.push("/");
            router.refresh();
            return;
          }
        }
      } catch (err) {
        console.error("Auto sign-in after registration error:", err);
      } finally {
        setIsSigningIn(false);
      }

      switchAccount("parent");
      router.push("/");
      router.refresh();
    },
  });

  const handleRegisterSubmit = (data: RegisterFormData) => {
    if (data?.phone) {
      setPhoneNumber(data.phone);
    }
    if (data?.password) {
      setPassword(data.password);
    }
    setStep("otp");
  };

  const handleOtpVerify = (otpCode: string) => {
    verifyOtp({
      phone: phoneNumber,
      code: otpCode,
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
      isLoading={isVerifying || isSigningIn}
      errorMessage={errorMessage}
      onBackToLogin={handleBackToRegister}
      onResendCode={() => console.log("Resending OTP code for phone:", phoneNumber)}
    />
  );
}

