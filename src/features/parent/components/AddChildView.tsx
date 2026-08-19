"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Camera, Calendar, Loader2 } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Toggle } from "@/components/ui";
import { calculateAgeInArabic } from "@/lib/utils";
import { addChildSchema, type AddChildFormData } from "../validation";


export const AddChildView: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAccountActive, setIsAccountActive] = useState<boolean>(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddChildFormData>({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      gender: "male",
      agreedToTerms: false,
      avatar: "",
    },
  });

  const birthDateValue = useWatch({ control, name: "birthDate" });

  const calculatedAge = useMemo(() => {
    return calculateAgeInArabic(birthDateValue);
  }, [birthDateValue]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setValue("avatar", previewUrl, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: AddChildFormData) => {
    setServerError(null);
    try {
      // Future API integration or local state dispatch
      console.log("[Add Child Form Submitted Data]:", data);
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push("/parents/childMangement");
    } catch {
      setServerError("حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white section-spacing" dir="rtl">
      <div className="container mx-auto">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION
           ========================================================================= */}
        <div className="flex items-center justify-start mb-4">
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  href="/"
                  className="text-mad-main font-bold hover:underline"
                >
                  الرئيسية
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  href="/parents/childMangement"
                  className="text-mad-main font-bold hover:underline"
                >
                  إدارة الأطفال
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page className="text-gray-500 font-medium">
                  إنشاء حساب طفل
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </div>

        {/* =========================================================================
            2. PAGE HEADER (Title + Description)
           ========================================================================= */}
        <div className="space-y-1 mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            إنشاء حساب طفل جديد
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            أضف حساباً خاصاً بطفلك لتمكينه من استكشاف القصص التعليمية الموجهة وحل الاختبارات التفاعلية الممتعة.
          </p>
        </div>

        {/* =========================================================================
            3. CHILD PROFILE FORM CARD
           ========================================================================= */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-10">
          {/* Card Header */}
          <h2 className="text-mad-main font-bold text-lg sm:text-xl">
            بيانات ملف الطفل
          </h2>
          <div className="border-b border-gray-100 mt-4 mb-8" />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Avatar Upload Section (Aligned Right) */}
            <div className="flex flex-col items-start justify-start text-right">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative size-24 sm:size-28 rounded-full border-2 border-mad-main/40 bg-purple-50/50 flex items-center justify-center cursor-pointer transition-all hover:ring-4 hover:ring-mad-main/10 group"
              >
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="صورة الطفل"
                    width={112}
                    height={112}
                    className="size-full object-cover rounded-full"
                  />
                ) : (
                  <User className="size-12 sm:size-14 text-mad-main stroke-[1.5]" />
                )}

                {/* Camera Icon Badge */}
                <div className="absolute bottom-0 left-0 size-7 sm:size-8 rounded-full bg-mad-main text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                  <Camera className="size-4 stroke-[2.2]" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs sm:text-sm text-gray-500 font-medium mt-2 hover:text-mad-main transition-colors cursor-pointer pr-4"
              >
                أضف صورة
              </button>
            </div>

            {/* Account Status Toggle (Aligned Right) */}
            <div className="flex items-center justify-start gap-4 pt-2">
              <span className="text-sm sm:text-base font-bold text-gray-800">
                حالة حساب الطفل
              </span>
              <Toggle
                checked={isAccountActive}
                onChange={setIsAccountActive}
                size="lg"
                activeColor="bg-green-600"
                ariaLabel="حالة حساب الطفل"
              />
            </div>

            {/* Top-level Server Error Message if any */}
            {serverError && (
              <div className="p-3.5 rounded-2xl bg-red-50 text-red-600 text-xs sm:text-sm font-semibold border border-red-100">
                {serverError}
              </div>
            )}

            {/* Form Fields Grid: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Right Column: Child Name */}
              <div className="space-y-2">
                <label
                  htmlFor="childName"
                  className="block text-xs sm:text-sm font-bold text-gray-800 text-right"
                >
                  اسم الطفل <span className="text-red-500">*</span>
                </label>
                <input
                  id="childName"
                  type="text"
                  maxLength={50}
                  {...register("name")}
                  disabled={isSubmitting}
                  placeholder="اكتب اسم طفلك هنا (الحد الأقصى 50 حرفاً)"
                  className={`w-full border rounded-2xl px-4 py-3.5 bg-white text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all font-medium text-right ${
                    errors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-mad-main focus:ring-2 focus:ring-mad-main/10"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-semibold mt-1 text-right">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Left Column: Birth Date */}
              <div className="space-y-2">
                <label
                  htmlFor="childBirthDate"
                  className="block text-xs sm:text-sm font-bold text-gray-800 text-right"
                >
                  تاريخ الميلاد <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="childBirthDate"
                    type="date"
                    {...register("birthDate")}
                    disabled={isSubmitting}
                    className={`date-input w-full border rounded-2xl px-4 py-3.5 pr-11 bg-white text-xs sm:text-sm text-gray-900 outline-none transition-all font-medium cursor-pointer ${
                      errors.birthDate
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-mad-main focus:ring-2 focus:ring-mad-main/10"
                    }`}
                  />
                  <Calendar className="size-4.5 text-gray-400 absolute right-4 pointer-events-none stroke-[2]" />
                </div>
                {errors.birthDate && (
                  <p className="text-xs text-red-500 font-semibold mt-1 text-right">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* Right Column: Age (Auto-calculated) */}
              <div className="space-y-2">
                <label
                  htmlFor="calculatedAge"
                  className="block text-xs sm:text-sm font-bold text-gray-800 text-right"
                >
                  العمر (تحدد تلقائياً)
                </label>
                <input
                  id="calculatedAge"
                  type="text"
                  readOnly
                  value={calculatedAge}
                  placeholder="تحدد تلقائياً بناءً على تاريخ الميلاد"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 bg-gray-50/70 text-xs sm:text-sm text-gray-700 outline-none font-medium cursor-not-allowed text-right"
                />
              </div>

              {/* Left Column: Gender */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-gray-800 text-right">
                  الجنس <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6 pt-2">
                  {/* Female */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      value="female"
                      {...register("gender")}
                      disabled={isSubmitting}
                      className="size-4.5 accent-mad-main cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-gray-700">
                      أنثى
                    </span>
                  </label>

                  {/* Male */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      value="male"
                      {...register("gender")}
                      disabled={isSubmitting}
                      className="size-4.5 accent-mad-main cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-gray-700">
                      ذكر
                    </span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-xs text-red-500 font-semibold mt-1 text-right">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions Checkbox (Aligned Right) */}
            <div className="pt-2">
              <label className="flex items-start sm:items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("agreedToTerms")}
                  disabled={isSubmitting}
                  className="size-4.5 mt-0.5 sm:mt-0 rounded-md accent-mad-main cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed text-right">
                  أوافق على شروط الاشتراك وسياسة الاستخدام المخصصة للأطفال في منصة مدارك القراءة.
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="text-xs text-red-500 font-semibold mt-1 text-right">
                  {errors.agreedToTerms.message}
                </p>
              )}
            </div>

            {/* Action Buttons (Aligned Right in RTL) */}
            <div className="flex items-center justify-start gap-4 pt-4">
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer min-w-[140px] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4.5 animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  "حفظ التغيرات"
                )}
              </button>

              {/* Cancel Button */}
              <Link
                href="/parents/childMangement"
                className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-sm sm:text-base transition-all active:scale-95 text-center min-w-[120px]"
              >
                إلغاء
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChildView;