"use client";

import React from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import ChildFormSkeleton from "./ChildFormSkeleton";

export const AddChildSkeleton: React.FC<{ isEditMode?: boolean }> = ({ isEditMode = false }) => {
  return (
    <div className="w-full min-h-screen bg-white section-spacing select-none" dir="rtl">
      <div className="container mx-auto">
        {/* =========================================================================
            1. BREADCRUMBS NAVIGATION SKELETON
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
            2. PAGE HEADER SKELETON
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
            3. CHILD FORM SKELETON
           ========================================================================= */}
        <ChildFormSkeleton isEditMode={isEditMode} />
      </div>
    </div>
  );
};

export default AddChildSkeleton;
