"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { parentSettingsSchema, type ParentSettingsFormData } from "../validation";

export interface ParentProfileFormProps {
  defaultValues: {
    name: string;
    phone: string;
  };
  onSubmit: (data: ParentSettingsFormData) => Promise<void> | void;
  onCancel: () => void;
}

export const ParentProfileForm: React.FC<ParentProfileFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ParentSettingsFormData>({
    resolver: zodResolver(parentSettingsSchema),
    defaultValues: {
      name: defaultValues.name,
      phone: defaultValues.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    reset({
      name: defaultValues.name,
      phone: defaultValues.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [defaultValues.name, defaultValues.phone, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 sm:space-y-5 animate-in fade-in duration-200"
      noValidate
    >
      {/* 1. Full Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="parentFullName"
          className="block text-xs sm:text-sm font-semibold text-gray-800 text-right"
        >
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <input
          id="parentFullName"
          type="text"
          {...register("name")}
          disabled={isSubmitting}
          placeholder="الاسم الكامل"
          className={`w-full px-4 py-3 bg-white border rounded-xl text-xs sm:text-sm text-gray-900 font-medium text-right focus:outline-none transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            errors.name
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-200 focus:ring-2 focus:ring-[#7F48EF]/30 focus:border-[#7F48EF]"
          }`}
        />
        {errors.name && (
          <p className="text-xs text-red-500 font-semibold text-right">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* 2. Phone Number (Read-only) */}
      <div className="space-y-1.5">
        <label
          htmlFor="parentPhoneNumber"
          className="block text-xs sm:text-sm font-semibold text-gray-800 text-right"
        >
          رقم الهاتف
        </label>
        <input
          id="parentPhoneNumber"
          type="tel"
          value={defaultValues.phone || ""}
          readOnly
          disabled
          dir="ltr"
          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 font-medium text-right cursor-not-allowed select-none focus:outline-none"
        />
      </div>

      {/* 3. Current Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="parentCurrentPassword"
          className="block text-xs sm:text-sm font-semibold text-gray-800 text-right"
        >
          كلمة المرور الحالية
        </label>
        <input
          id="parentCurrentPassword"
          type="password"
          {...register("currentPassword")}
          disabled={isSubmitting}
          placeholder="••••••••"
          className={`w-full px-4 py-3 bg-white border rounded-xl text-xs sm:text-sm text-gray-900 font-medium text-right focus:outline-none transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            errors.currentPassword
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-200 focus:ring-2 focus:ring-[#7F48EF]/30 focus:border-[#7F48EF]"
          }`}
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-500 font-semibold text-right">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* 4. New Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="parentNewPassword"
          className="block text-xs sm:text-sm font-semibold text-gray-800 text-right"
        >
          كلمة المرور الجديدة
        </label>
        <input
          id="parentNewPassword"
          type="password"
          {...register("newPassword")}
          disabled={isSubmitting}
          placeholder="••••••••"
          className={`w-full px-4 py-3 bg-white border rounded-xl text-xs sm:text-sm text-gray-900 font-medium text-right focus:outline-none transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            errors.newPassword
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-200 focus:ring-2 focus:ring-[#7F48EF]/30 focus:border-[#7F48EF]"
          }`}
        />
        {errors.newPassword && (
          <p className="text-xs text-red-500 font-semibold text-right">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* 5. Confirm New Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="parentConfirmPassword"
          className="block text-xs sm:text-sm font-semibold text-gray-800 text-right"
        >
          تأكيد كلمة المرور الجديدة
        </label>
        <input
          id="parentConfirmPassword"
          type="password"
          {...register("confirmPassword")}
          disabled={isSubmitting}
          placeholder="••••••••"
          className={`w-full px-4 py-3 bg-white border rounded-xl text-xs sm:text-sm text-gray-900 font-medium text-right focus:outline-none transition-all placeholder:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            errors.confirmPassword
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-200 focus:ring-2 focus:ring-[#7F48EF]/30 focus:border-[#7F48EF]"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 font-semibold text-right">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Edit Actions (Aligned to bottom-left in RTL) */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-full bg-[#7F48EF] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <span>حفظ التعديلات</span>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-full border border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default ParentProfileForm;
