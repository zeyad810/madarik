"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { AutoBreadcrumbs } from "@/components/ui/Breadcrumb";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useStudentProfile } from "../hooks/useStudentProfile";
import { StudentProfileCard } from "./StudentProfileCard";

export const StudentProfileView: React.FC = () => {
  const { activeAccount, isLoading: isAccountLoading } = useActiveAccount();
  const { data: profileResponse, isLoading: isProfileLoading } = useStudentProfile();

  const studentUser = profileResponse?.data?.user;

  // Fallback info from activeAccount / session while loading or if profile is delayed
  const name = studentUser?.name || activeAccount?.name || "الطالب";
  const avatarUrl =
    studentUser?.avatar_img ||
    activeAccount?.avatar_img ||
    activeAccount?.avatar;
  const gender = studentUser?.gender || (activeAccount as any)?.gender || "male";
  const age = studentUser?.age;
  const birthDate = studentUser?.birth_date;
  const schoolName = studentUser?.school?.name;
  const status = studentUser?.status || activeAccount?.status || "active";

  const isLoading = (isAccountLoading || isProfileLoading) && !studentUser && !activeAccount?.name;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-[#7939E3]" />
        <p className="text-slate-600 font-bold text-sm">جاري تحميل بيانات الملف الشخصي...</p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-[85vh] flex flex-col justify-between select-none bg-white"
    >
      {/* ─────────────────── TOP BREADCRUMB ─────────────────── */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <AutoBreadcrumbs
          rootIcon={null}
          dynamicLabels={{ profile: "الملف الشخصي", student: "حساب الطالب" }}
        />
      </div>

      {/* ─────────────────── MAIN CONTENT SECTION ─────────────────── */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-6">
          {/* Page Heading matching parent text */}
          <div className="flex flex-col gap-1.5 text-right">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              بيانات ملف الطالب
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              قم بمراجعة وتحديث بيانات ملفك وحالتك التعليمية في منصة مدارك القراءة.
            </p>
          </div>

          {/* Student Profile Card */}
          <StudentProfileCard
            name={name}
            avatarUrl={avatarUrl}
            gender={gender}
            age={age}
            birthDate={birthDate}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;
