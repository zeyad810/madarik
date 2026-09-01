"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Toggle, ChildFormSkeleton, AddChildSkeleton } from "@/components/ui";
import { calculateAgeInArabic, getAgeCategoryFromBirthDate } from "@/lib/utils";
import {
  addChildSchema,
  updateChildSchema,
  type AddChildFormData,
  type UpdateChildFormData,
} from "../validation";
import {
  useAddChild,
  useUpdateChild,
  useToggleChildStatus,
  useParentChildren,
  useChild,
} from "../hooks";
import { ChildStatusConfirmModal } from "./ChildStatusConfirmModal";
import type { ManagedChild } from "../types";

export const AddChildView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode and target child ID from URL search parameters
  const mode = searchParams.get("mode") === "edit" ? "edit" : "add";
  const childId = searchParams.get("id") || searchParams.get("childId");
  const isEditMode = mode === "edit";

  const [serverError, setServerError] = useState<string | null>(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [statusOverride, setStatusOverride] = useState<"active" | "inactive" | null>(null);

  // Fetch children list to populate data in edit mode
  const { children: parentChildren, isLoading: isChildrenLoading } = useParentChildren();
  // Fetch single child data directly from /children/{id}
  const { child: singleChild, isLoading: isSingleChildLoading } = useChild(isEditMode ? childId : null);

  // Target child raw object when in edit mode
  const targetChild = useMemo(() => {
    if (!isEditMode) return null;
    if (singleChild) return singleChild;
    if (childId) {
      const found = parentChildren?.find((c) => String(c.id) === String(childId));
      if (found) return found;
    }
    if (parentChildren && parentChildren.length === 1) {
      return parentChildren[0];
    }
    return null;
  }, [isEditMode, singleChild, childId, parentChildren]);

  // Target child mapped to ManagedChild format for status modal & card matching
  const mappedTargetChild: ManagedChild | null = useMemo(() => {
    if (!targetChild) return null;
    return {
      id: String(targetChild.id),
      name: targetChild.name,
      ageCategory: getAgeCategoryFromBirthDate(targetChild.birth_date),
      avatar:
        targetChild.avatar_img ||
        targetChild.avatar ||
        (targetChild.gender === "female" ? "/assets/girl_avatar.png" : "/assets/boy_avatar.png"),
      avatar_img: targetChild.avatar_img || targetChild.avatar,
      gender: (targetChild.gender === "female" ? "female" : "male") as "male" | "female",
      status: (targetChild.status === "deactivated" || targetChild.status === "inactive"
        ? "inactive"
        : "active") as "active" | "inactive",
      birthDate: targetChild.birth_date,
      badgesCount: targetChild.badges_count ?? targetChild.badges ?? 0,
    };
  }, [targetChild]);

  const currentStatus = statusOverride || mappedTargetChild?.status || "active";
  const isAccountActive = currentStatus === "active";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddChildFormData | UpdateChildFormData>({
    resolver: zodResolver(isEditMode ? updateChildSchema : addChildSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      gender: "male",
      agreedToTerms: isEditMode ? true : false,
    },
  });

  // Populate or reset form values when mode or targetChild changes
  useEffect(() => {
    if (isEditMode && targetChild) {
      let formattedDate = "";
      if (targetChild.birth_date) {
        formattedDate = targetChild.birth_date.split("T")[0].split(" ")[0];
      }
      reset({
        name: targetChild.name || "",
        birthDate: formattedDate,
        gender: targetChild.gender === "female" ? "female" : "male",
        agreedToTerms: true,
      });
    } else if (!isEditMode) {
      setStatusOverride(null);
      reset({
        name: "",
        birthDate: "",
        gender: "male",
        agreedToTerms: false,
      });
    }
  }, [isEditMode, targetChild, reset]);

  const addChildMutation = useAddChild();
  const updateChildMutation = useUpdateChild();
  const toggleStatusMutation = useToggleChildStatus();

  const isPending =
    isSubmitting || addChildMutation.isPending || updateChildMutation.isPending;

  const birthDateValue = useWatch({ control, name: "birthDate" });

  const calculatedAge = useMemo(() => {
    return calculateAgeInArabic(birthDateValue);
  }, [birthDateValue]);

  // Open the confirmation modal when user clicks the toggle switch
  const handleOpenToggleModal = () => {
    if (mappedTargetChild) {
      setIsToggleModalOpen(true);
    }
  };

  // Close the confirmation modal
  const handleCloseToggleModal = () => {
    if (!toggleStatusMutation.isPending) {
      setIsToggleModalOpen(false);
    }
  };

  // Perform status toggle after user confirms in the modal (same as in ChildCard)
  const handleConfirmToggleStatus = () => {
    if (!mappedTargetChild) return;

    const nextStatus = isAccountActive ? "inactive" : "active";
    setStatusOverride(nextStatus);

    toggleStatusMutation.mutate(
      { childId: mappedTargetChild.id },
      {
        onError: () => {
          setStatusOverride(null);
        },
        onSuccess: () => {
          setStatusOverride(null);
          setIsToggleModalOpen(false);
        },
        onSettled: () => {
          setIsToggleModalOpen(false);
        },
      }
    );
  };

  const onSubmit = (data: AddChildFormData | UpdateChildFormData) => {
    setServerError(null);

    if (isEditMode) {
      const activeChildId = childId || targetChild?.id;
      if (!activeChildId) {
        setServerError("تعذر تحديد معرف الطفل المراد تعديله");
        return;
      }

      updateChildMutation.mutate(
        {
          id: activeChildId,
          name: data.name,
          birth_date: data.birthDate,
          gender: data.gender,
        },
        {
          onSuccess: () => {
            router.push("/parents/childMangement");
            
          },
          onError: (error) => {
            if (error instanceof Error) {
              setServerError(error.message);
            }
          },
        }
      );
    } else {
      addChildMutation.mutate(
        {
          name: data.name,
          birth_date: data.birthDate,
          gender: data.gender,
          status: "active",
        },
        {
          onSuccess: () => {
            router.push("/parents/childMangement");
            
          },
          onError: (error) => {
            if (error instanceof Error) {
              setServerError(error.message);
            }
          },
        }
      );
    }
  };

  // If in edit mode and data is still loading
  const isInitialLoading = isEditMode && (isChildrenLoading || isSingleChildLoading) && !targetChild;

  // If in edit mode, loading finished, and child is not found
  const isChildNotFound = isEditMode && !isChildrenLoading && !isSingleChildLoading && !targetChild && parentChildren && parentChildren.length > 0;

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
                  {isEditMode ? "تعديل بيانات الطفل" : "إنشاء حساب طفل"}
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
            {isEditMode ? "تعديل بيانات الطفل" : "إنشاء حساب طفل جديد"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            {isEditMode
              ? "قم بتحديث وتعديل بيانات ملف طفلك بسهولة لمتابعة رحلته التعليمية."
              : "أضف حساباً خاصاً بطفلك لتمكينه من استكشاف القصص التعليمية الموجهة وحل الاختبارات التفاعلية الممتعة."}
          </p>
        </div>

        {/* =========================================================================
            3. CHILD PROFILE FORM CARD / NOT FOUND / SKELETON
           ========================================================================= */}
        {isInitialLoading ? (
          <ChildFormSkeleton isEditMode={isEditMode} />
        ) : isChildNotFound ? (
          <div className="bg-white rounded-3xl border border-red-100 shadow-xs p-8 text-center space-y-4">
            <div className="size-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              لم يتم العثور على بيانات الطفل المطلوب
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              قد يكون تم حذف الحساب أو المعرف غير صالح. يرجى العودة لصفحة إدارة الأطفال واختيار الطفل مجدداً.
            </p>
            <div className="pt-2">
              <Link
                href="/parents/childMangement"
                className="inline-flex px-6 py-2.5 rounded-full bg-mad-main text-white font-bold text-sm shadow-sm hover:shadow transition-all"
              >
                العودة إلى إدارة الأطفال
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-10">
            {/* Card Header */}
            <h2 className="text-mad-main font-bold text-lg sm:text-xl">
              بيانات ملف الطفل
            </h2>
            <div className="border-b border-gray-100 mt-4 mb-8" />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
              {/* Top-level Server Error Message if any */}
              {serverError && (
                <div className="p-3.5 rounded-2xl bg-red-50 text-red-600 text-xs sm:text-sm font-semibold border border-red-100">
                  {serverError}
                </div>
              )}

              {/* Account Status Row (Shown only in Edit Mode, matching ChildCard style & modal) */}
              {isEditMode && mappedTargetChild && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    حالة حساب الطفل
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`font-bold text-xs ${isAccountActive ? "text-[#22C55E]" : "text-gray-400"
                        }`}
                    >
                      {isAccountActive ? "مفعل" : "معطل"}
                    </span>
                    <Toggle
                      checked={isAccountActive}
                      disabled={toggleStatusMutation.isPending}
                      onChange={handleOpenToggleModal}
                      ariaLabel="حالة حساب الطفل"
                    />
                  </div>
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
                    disabled={isPending}
                    placeholder="اكتب اسم طفلك هنا (الحد الأقصى 50 حرفاً)"
                    className={`w-full border rounded-2xl px-4 py-3.5 bg-white text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all font-medium text-right ${errors.name
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
                      disabled={isPending}
                      className={`date-input w-full border rounded-2xl px-4 py-3.5 pr-11 bg-white text-xs sm:text-sm text-gray-900 outline-none transition-all font-medium cursor-pointer ${errors.birthDate
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
                        disabled={isPending}
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
                        disabled={isPending}
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

              {/* Terms & Conditions Checkbox (Shown only in Add Mode) */}
              {!isEditMode && (
                <div className="pt-2">
                  <label className="flex items-start sm:items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("agreedToTerms")}
                      disabled={isPending}
                      className="size-4.5 mt-0.5 sm:mt-0 rounded-md accent-mad-main cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed text-right">
                      أوافق على شروط الاشتراك وسياسة الاستخدام المخصصة للأطفال في منصة مدارك القراءة.
                    </span>
                  </label>
                  {"agreedToTerms" in errors && errors.agreedToTerms && (
                    <p className="text-xs text-red-500 font-semibold mt-1 text-right">
                      {errors.agreedToTerms.message}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons (Aligned Right in RTL) */}
              <div className="flex items-center justify-start gap-4 pt-4">
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-3 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer min-w-[140px] flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4.5 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : isEditMode ? (
                    "حفظ التعديلات"
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
        )}

        {/* =========================================================================
            4. CHILD STATUS CONFIRMATION MODAL (Warning for Off, Green for On)
           ========================================================================= */}
        {isEditMode && mappedTargetChild && (
          <ChildStatusConfirmModal
            isOpen={isToggleModalOpen}
            child={{ ...mappedTargetChild, status: currentStatus }}
            onClose={handleCloseToggleModal}
            onConfirm={handleConfirmToggleStatus}
            isLoading={toggleStatusMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export { ChildFormSkeleton, AddChildSkeleton } from "@/components/ui";
export default AddChildView;