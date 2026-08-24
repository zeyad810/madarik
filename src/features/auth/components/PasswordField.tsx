"use client";

import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  typography: {
    label: string;
    input: string;
    error: string;
  };
  colors: {
    label: string;
    required: string;
    inputBorder: string;
    inputFocusBorder: string;
    inputText: string;
    inputPlaceholder: string;
    eyeIcon: string;
    errorText: string;
  };
  hidePasswordLabel?: string;
  showPasswordLabel?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  placeholder,
  register,
  error,
  disabled = false,
  required = true,
  typography,
  colors,
  hidePasswordLabel = "إخفاء كلمة المرور",
  showPasswordLabel = "إظهار كلمة المرور",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 text-right">
      <label htmlFor={id} className={`${typography.label} ${colors.label}`}>
        {label} {required && <span className={colors.required}>*</span>}
      </label>
      <div
        className={`relative flex items-center border ${colors.inputBorder} rounded-2xl px-4 py-3.5 bg-white ${colors.inputFocusBorder} transition-all shadow-xs`}
      >
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register}
          disabled={disabled}
          className={`w-full bg-transparent border-none outline-none ${typography.input} ${colors.inputText} ${colors.inputPlaceholder} tracking-widest font-sans`}
          dir="rtl"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className={`${colors.eyeIcon} transition-colors pr-1 focus:outline-none cursor-pointer shrink-0`}
          aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
        >
          {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <span className={`${typography.error} ${colors.errorText} mt-0.5`}>
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordField;
