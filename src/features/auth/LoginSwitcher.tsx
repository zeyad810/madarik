"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { Child } from "@/types/auth";
import { Loader2 } from "lucide-react";

interface LoginSwitcherProps {
  onComplete?: () => void;
}

export const LoginSwitcher: React.FC<LoginSwitcherProps> = ({ onComplete }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { switchAccount, activeId } = useActiveAccount();

  const user = session?.user;
  const children: Child[] = user?.children || [];

  // Default selection: currently active ID or "parent"
  const [selectedId, setSelectedId] = useState<string>(activeId || "parent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parentName = user?.name || "ولي الأمر";

  const handleContinue = () => {
    setIsSubmitting(true);
    switchAccount(selectedId);

    if (onComplete) {
      onComplete();
    } else {
      const callbackUrl = searchParams?.get("callbackUrl");
      const targetUrl = callbackUrl || "/";
      router.push(targetUrl);
      router.refresh();
    }
  };

  if (status === "loading") {
    return (
      <div className="w-full max-w-[440px] px-4 py-12 flex flex-col items-center justify-center font-sans">
        <Loader2 className="size-8 animate-spin text-mad-main mb-4" />
        <span className="text-sm font-semibold text-gray-500">جاري تحميل بيانات الحساب...</span>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[440px] px-4 py-8 flex flex-col items-center justify-center font-sans animate-in fade-in zoom-in-95 duration-200"
      dir="rtl"
    >
      {/* 1. Centered Logo */}
      <div className="mb-5 flex justify-center">
        <Image
          src="/logo- 1.png"
          alt="شعار مدارك القراءة"
          width={130}
          height={130}
          className="w-auto h-24 sm:h-28 object-contain"
          priority
        />
      </div>

      {/* 2. Main Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
        تسجيل الدخول كـ
      </h1>

      {/* 3. Account Profiles Selection Cards */}
      <div className="w-full flex items-center justify-center gap-3 sm:gap-4 mb-8 flex-wrap">
        {/* Parent Card */}
        <button
          type="button"
          onClick={() => setSelectedId("parent")}
          className={`w-24 sm:w-28 py-4 px-2.5 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer border ${
            selectedId === "parent"
              ? "border-2 border-mad-main bg-[#F8F5FF] shadow-md scale-102"
              : "border border-gray-100 bg-white hover:border-gray-200 shadow-xs hover:scale-101"
          }`}
        >
          <div
            className={`size-13 rounded-full overflow-hidden p-0.5 ring-2 ${
              selectedId === "parent" ? "ring-mad-main" : "ring-purple-100"
            } shrink-0 bg-purple-50`}
          >
            <Image
              src="/assets/user_avatar.png"
              alt={parentName}
              width={52}
              height={52}
              className="size-full object-cover rounded-full"
            />
          </div>
          <span className="text-xs sm:text-sm font-bold text-gray-800 text-center truncate max-w-full">
            ولي الأمر
          </span>
        </button>

        {/* Children Cards */}
        {children.map((child, index) => {
          const isSelected = selectedId === child.id;
          const avatarSrc =
            child.gender === "female"
              ? "/assets/girl_avatar.png"
              : "/assets/boy_avatar.png";

          return (
            <button
              key={child.id || index}
              type="button"
              onClick={() => setSelectedId(child.id)}
              className={`w-24 sm:w-28 py-4 px-2.5 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? "border-2 border-mad-main bg-[#F8F5FF] shadow-md scale-102"
                  : "border border-gray-100 bg-white hover:border-gray-200 shadow-xs hover:scale-101"
              }`}
            >
              <div
                className={`size-13 rounded-full overflow-hidden p-0.5 ring-2 ${
                  isSelected ? "ring-mad-main" : "ring-purple-100"
                } shrink-0 bg-purple-50`}
              >
                <Image
                  src={avatarSrc}
                  alt={child.name}
                  width={52}
                  height={52}
                  className="size-full object-cover rounded-full"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800 text-center truncate max-w-full">
                {child.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Continue Action Button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-full bg-mad-main hover:bg-mad-purple-800 text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>جاري المتابعة...</span>
          </>
        ) : (
          <span>متابعة</span>
        )}
      </button>
    </div>
  );
};

export default LoginSwitcher;