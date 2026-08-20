"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { Child } from "@/types/auth";
import { Loader2, LogOut } from "lucide-react";

interface LoginSwitcherProps {
  onComplete?: () => void;
  onSwitchUser?: () => void;
}

export const LoginSwitcher: React.FC<LoginSwitcherProps> = ({
  onComplete,
  onSwitchUser,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const { switchAccount, activeId, resetAccount } = useActiveAccount();

  const user = session?.user;
  const children: Child[] = user?.children || [];

  // Default selection: currently active ID or "parent"
  const [selectedId, setSelectedId] = useState<string>(activeId || "parent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selection if activeId loads
  useEffect(() => {
    if (activeId) {
      setSelectedId(activeId);
    }
  }, [activeId]);

  // Force session update on mount if session data is still empty
  useEffect(() => {
    if (status === "authenticated" && !user) {
      update();
    }
  }, [status, user, update]);

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

  const handleDifferentAccount = async () => {
    resetAccount();
    if (onSwitchUser) {
      onSwitchUser();
    }
    await signOut({ redirect: false });
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
      <div className="w-full flex items-center justify-center gap-3.5 sm:gap-4 mb-8 flex-wrap p-1">
        {/* Parent Card */}
        <button
          type="button"
          onClick={() => setSelectedId("parent")}
          className={`min-w-[105px] sm:min-w-[116px] py-4 sm:py-5 px-3 rounded-[22px] flex flex-col items-center justify-center gap-3 transition-all duration-150 cursor-pointer outline-none focus:outline-none ${
            selectedId === "parent"
              ? "border-2 border-[#7C3AED] bg-[#FAF8FF] shadow-sm"
              : "border-2 border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50"
          }`}
        >
          <div
            className={`size-14 rounded-full overflow-hidden p-0.5 ring-2 ${
              selectedId === "parent" ? "ring-[#7C3AED]/30" : "ring-purple-50"
            } shrink-0 bg-purple-50 flex items-center justify-center`}
          >
            <Image
              src="/assets/user_avatar.png"
              alt={parentName}
              width={56}
              height={56}
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
            child.avatar_img ||
            child.avatar ||
            (child.gender === "female"
              ? "/assets/girl_avatar.png"
              : "/assets/boy_avatar.png");

          return (
            <button
              key={child.id || index}
              type="button"
              onClick={() => setSelectedId(child.id)}
              className={`min-w-[105px] sm:min-w-[116px] py-4 sm:py-5 px-3 rounded-[22px] flex flex-col items-center justify-center gap-3 transition-all duration-150 cursor-pointer outline-none focus:outline-none ${
                isSelected
                  ? "border-2 border-[#7C3AED] bg-[#FAF8FF] shadow-sm"
                  : "border-2 border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50"
              }`}
            >
              <div
                className={`size-14 rounded-full overflow-hidden p-0.5 ring-2 ${
                  isSelected ? "ring-[#7C3AED]/30" : "ring-purple-50"
                } shrink-0 bg-purple-50 flex items-center justify-center`}
              >
                <Image
                  src={avatarSrc}
                  alt={child.name}
                  width={56}
                  height={56}
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

      {/* 5. Switch to a Different Account Link */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={handleDifferentAccount}
          className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-mad-main underline transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <LogOut className="size-3.5" />
          <span>تسجيل الدخول برقم هاتف آخر</span>
        </button>
      </div>
    </div>
  );
};

export default LoginSwitcher;