"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AUTH_TEXTS, AUTH_TYPOGRAPHY, AUTH_COLORS } from "./constants";

interface OtpProps {
  phoneNumber?: string;
  onVerifySuccess?: (otpCode: string) => void;
  onResendCode?: () => void;
  onBackToLogin?: () => void;
  initialTimerSeconds?: number;
  texts?: typeof AUTH_TEXTS.otp;
  typography?: typeof AUTH_TYPOGRAPHY;
  colors?: typeof AUTH_COLORS;
}

const Otp: React.FC<OtpProps> = ({
  phoneNumber = AUTH_TEXTS.otp.defaultPhone,
  onVerifySuccess,
  onResendCode,
  onBackToLogin,
  initialTimerSeconds = 300,
  texts = AUTH_TEXTS.otp,
  typography = AUTH_TYPOGRAPHY,
  colors = AUTH_COLORS,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState<number>(initialTimerSeconds);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const numericValue = value.replace(/\D/g, "");

    const newDigits = [...digits];

    if (numericValue.length > 1) {
      // Paste multi-digit code case
      const pastedDigits = numericValue.slice(0, 6).split("");
      pastedDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newDigits[index] = numericValue.slice(-1);
      setDigits(newDigits);
      setErrorMsg("");

      // Auto-advance focus to next input
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = Array(6).fill("");
    pastedData.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    setErrorMsg("");
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(initialTimerSeconds);
    setDigits(Array(6).fill(""));
    setErrorMsg("");
    inputRefs.current[0]?.focus();
    if (onResendCode) {
      onResendCode();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = digits.join("");
    if (otpCode.length < 6) {
      setErrorMsg(AUTH_TEXTS.validation.otpInvalid);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    if (onVerifySuccess) {
      onVerifySuccess(otpCode);
    } else {
      console.log("OTP Submitted:", otpCode);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-[480px] px-4 py-8 flex flex-col items-center justify-center font-sans" dir="rtl">
      {/* 3D Lock Icon */}
      <div className="mb-6">
        <Image
          src="/assets/lock.png"
          alt={texts.lockAlt}
          width={100}
          height={100}
          className="w-24 h-24 object-contain"
          priority
        />
      </div>

      {/* Heading */}
      <h1 className={`${typography.otpHeading} ${colors.heading} mb-3 text-center tracking-tight`}>
        {texts.heading}
      </h1>

      {/* Subtitle & Phone Number */}
      <div className="text-center mb-8 space-y-1">
        <p className={`${typography.otpDescription} text-[#98A2B3]`}>
          {texts.description}
        </p>
        <div className="flex items-center justify-center gap-2">
          <p className={`${typography.otpPhone} text-[#667085]`} dir="ltr">
            {phoneNumber}
          </p>
          {onBackToLogin && (
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs text-[#175CD3] hover:underline font-medium cursor-pointer"
            >
              (تعديل)
            </button>
          )}
        </div>
        <p className={`${typography.otpDescription} text-[#98A2B3] pt-1`}>
          {texts.instruction}
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-6">
        {/* 6 Digit Input Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full" dir="ltr">
          {digits.map((digit, index) => {
            const isFilled = Boolean(digit);
            return (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-11 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border bg-white ${
                  isFilled ? colors.otpBoxActive : colors.otpBoxBorder
                } ${typography.otpBox} ${colors.inputText} outline-none transition-all duration-200 shadow-xs`}
              />
            );
          })}
        </div>

        {/* Validation Error Message */}
        {errorMsg && (
          <span className={`${typography.error} ${colors.errorText} text-center`}>
            {errorMsg}
          </span>
        )}

        {/* Resend Code / Timer */}
        <div className="text-center space-y-1.5 text-sm">
          {timer === 0 ? (
            <button
              type="button"
              onClick={handleResend}
              className={`${typography.otpResend} ${colors.otpResendLink}`}
            >
              {texts.resendText}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0}
                className={`${typography.otpResend} text-[#98A2B3] cursor-not-allowed`}
              >
                {texts.resendText}
              </button>
              <p className={`${typography.otpDescription} text-[#667085]`}>
                {texts.resendTimerPrefix}{" "}
                <span className={`${typography.otpTimer} ${colors.otpTimerText}`}>
                  {formatTimer(timer)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || digits.join("").length < 6}
          className={`w-full py-3.5 px-6 rounded-full ${colors.submitButton} ${typography.button} transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]`}
        >
          {isSubmitting ? texts.submittingButton : texts.confirmButton}
        </button>
      </form>
    </div>
  );
};

export default Otp;
