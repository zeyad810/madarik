"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { Child } from "@/types/auth";
import { Loader2, LogOut } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { isStudentRole, isFreeRole } from "@/lib/roles";
import { clearStoredAuth } from "@/lib/auth";

import "swiper/css";
import "swiper/css/pagination";

interface LoginSwitcherProps {
  onComplete?: (session: ReturnType<typeof useSession>["data"]) => void;
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
  const rawRole = (session as any)?.user_type || (user as any)?.user_type;
  const isStudent = isStudentRole(rawRole);
  const children: Child[] = user?.children || [];

  // If user is student, redirect immediately to stories
  useEffect(() => {
    if (isStudent) {
      const callbackUrl = searchParams?.get("callbackUrl");
      const targetUrl = callbackUrl || "/stories";
      router.push(targetUrl);
      router.refresh();
    }
  }, [isStudent, router, searchParams]);

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
      onComplete(session);
    } else {
      // Default role-based redirect when used standalone (no onComplete prop)
      const callbackUrl = searchParams?.get("callbackUrl");
      const hasChildren = Array.isArray(children) && children.length > 0;

      let targetUrl: string;
      if (isStudent) {
        targetUrl = "/stories";
      } else if (isFreeRole(rawRole)) {
        targetUrl = "/packages";
      } else if (hasChildren) {
        targetUrl = callbackUrl || "/parents/childMangement";
      } else {
        targetUrl = callbackUrl || "/packages";
      }

      router.push(targetUrl);
      router.refresh();
    }
  };


  const handleDifferentAccount = async () => {
    resetAccount();
    clearStoredAuth();
    if (onSwitchUser) {
      onSwitchUser();
    }
    await signOut({ redirect: false });
  };

  // Prepare profiles list (Parent + Children)
  const profiles = useMemo(() => {
    const isParentActive = !user?.status || user?.status === "active";
    const parentProfile = {
      id: "parent",
      name: "ولي الأمر",
      avatar: "/assets/user_avatar.png",
      isActive: isParentActive,
    };

    const childProfiles = children.map((child, index) => ({
      id: child.id || `child-${index}`,
      name: child.name,
      avatar:
        child.avatar_img ||
        child.avatar ||
        (child.gender === "female"
          ? "/assets/girl_avatar.png"
          : "/assets/boy_avatar.png"),
      isActive: !child.status || child.status === "active",
    }));

    return [parentProfile, ...childProfiles];
  }, [children, user?.status]);

  const renderProfileCard = (profile: { id: string; name: string; avatar: string; isActive?: boolean }) => {
    const isSelected = selectedId === profile.id;
    const isActive = profile.isActive !== false;

    return (
      <button
        key={profile.id}
        type="button"
        disabled={!isActive}
        onClick={() => {
          if (isActive) setSelectedId(profile.id);
        }}
        className={`w-full min-w-[105px] sm:min-w-[116px] py-4 sm:py-5 px-3 rounded-[22px] flex flex-col items-center justify-center gap-3 transition-all duration-150 outline-none focus:outline-none ${
          !isActive
            ? "border-2 border-gray-100 bg-gray-50/70 opacity-50 cursor-not-allowed"
            : isSelected
            ? "border-2 border-[#7C3AED] bg-[#FAF8FF] shadow-sm cursor-pointer"
            : "border-2 border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50 cursor-pointer"
        }`}
      >
        <div
          className={`size-14 rounded-full overflow-hidden p-0.5 ring-2 ${
            isSelected ? "ring-[#7C3AED]/30" : "ring-purple-50"
          } shrink-0 bg-purple-50 flex items-center justify-center`}
        >
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={56}
            height={56}
            className="size-full object-cover rounded-full"
          />
        </div>
        <span className="text-xs sm:text-sm font-bold text-gray-800 text-center truncate max-w-full">
          {profile.name}
        </span>
      </button>
    );
  };

  if (status === "loading" || isStudent) {
    return (
      <div className="w-full max-w-[440px] px-4 py-12 flex flex-col items-center justify-center font-sans">
        <Loader2 className="size-8 animate-spin text-mad-main mb-4" />
        <span className="text-sm font-semibold text-gray-500">
          {isStudent ? "جاري توجيهك إلى صفحة القصص..." : "جاري تحميل بيانات الحساب..."}
        </span>
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

      {/* 3. Account Profiles Selection Cards (Slider if > 3 cards, otherwise flex layout) */}
      {profiles.length > 3 ? (
        <div className="w-full mb-6 relative">
          <Swiper
            modules={[Pagination]}
            dir="rtl"
            slidesPerView={2.6}
            spaceBetween={12}
            grabCursor
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 2.3,
                spaceBetween: 10,
              },
              360: {
                slidesPerView: 2.7,
                spaceBetween: 12,
              },
              420: {
                slidesPerView: 3,
                spaceBetween: 12,
              },
            }}
            className="w-full pb-7! pt-1 px-1 [&_.swiper-pagination-bullet-active]:!bg-mad-main [&_.swiper-pagination-bullet]:bg-purple-200"
          >
            {profiles.map((profile) => (
              <SwiperSlide key={profile.id} className="h-auto! flex justify-center py-1">
                {renderProfileCard(profile)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center gap-3.5 sm:gap-4 mb-8 p-1">
          {profiles.map(renderProfileCard)}
        </div>
      )}

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