"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  X,
  LogOut,
  User,
  Users,
  ChevronDown,
  ChevronUp,
  Award,
  UserPlus,
  Check,
  Sparkles,
  Lock,
} from "lucide-react";
import { SIDE_MENU_ITEMS } from "./constants";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { RoleGuard } from "@/components/guards";
import { useChild, useParentChildren } from "@/features/parent/hooks";
import { resolveChildBadgesCount } from "@/lib/children";

// Smooth spring physics — feels like a native drawer
const DRAWER_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 30,
  mass: 1,
  delay: 0.05,
} as const;
const DRAWER_EXIT = {
  type: "tween",
  ease: "easeInOut" as const,
  duration: 0.35,
} as const;

interface SideMenuProps {
  isOpen: boolean;
  activeCategory?: string;
  onClose: () => void;
  onSelectCategory?: (id: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const pathname = usePathname();
  const { status } = useSession();
  const {
    activeId,
    activeAccount,
    children: sessionChildren,
    userRole,
    isAuthenticated,
    createAccountHref,
    resetAccount,
    isStudent,
    isParentRole,
    isParentActive,
    isChildOrStudent,
    isFreeCustomer,
    switchAccount,
  } = useActiveAccount();
  const { children } = useParentChildren();
  const activeChildId =
    activeAccount?.type === "child" ? activeAccount.id : null;
  const { child: activeChildDetails } = useChild(activeChildId);
  const activeChildBadges = resolveChildBadgesCount(
    activeChildDetails ||
      children.find((child) => child.id === activeChildId) ||
      activeAccount?.rawChild ||
      sessionChildren.find((child) => child.id === activeChildId)
  );

  // State to expand/collapse the account switcher
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const visibleMenuItems = useMemo(() => {
    // For unauthenticated visitors, show all side menu items
    if (!isAuthenticated) {
      return SIDE_MENU_ITEMS;
    }

    return SIDE_MENU_ITEMS.filter((item) => {
      // 1. Hide any package or subscription item from child & student
      const isPackageOrSub =
        item.id === "packages" ||
        item.id === "pricing" ||
        item.id === "subscriptions" ||
        item.id === "sub-status" ||
        item.id === "sub-history" ||
        item.href.includes("/packages") ||
        item.href.includes("/subscriptions") ||
        item.href.includes("/subscription-status");

      if (isPackageOrSub && isChildOrStudent) {
        return false;
      }

      const isResultsItem =
        item.id === "results" ||
        item.id === "attempts-log" ||
        item.href.startsWith("/results") ||
        item.href.startsWith("/attempts");

      // Results/attempts log is strictly for authenticated student, parent, child
      // and NEVER for free_customer
      if (isResultsItem) {
        if (isFreeCustomer) {
          return false;
        }
        const hasHistoryRole =
          userRole === "student" || userRole === "parent" || userRole === "child";
        if (!hasHistoryRole) {
          return false;
        }
      }

      // Check item.allowedRoles
      if (item.allowedRoles && item.allowedRoles.length > 0) {
        const hasAccess =
          item.allowedRoles.includes(userRole) ||
          (isFreeCustomer &&
            (item.allowedRoles.includes("free") ||
              item.allowedRoles.includes("free_customer")));
        if (!hasAccess) {
          return false;
        }
      }

      if (isChildOrStudent) {
        return (
          item.id === "home" ||
          item.id === "available-stories" ||
          item.id === "attempts-log" ||
          item.id === "results" ||
          item.href === "/" ||
          item.href.startsWith("/stories") ||
          item.href.startsWith("/results") ||
          item.href.startsWith("/attempts")
        );
      }
      return true;
    });
  }, [isAuthenticated, isFreeCustomer, isChildOrStudent, userRole]);

  const isItemDisabled = (item: (typeof SIDE_MENU_ITEMS)[number]) => {
    if (!isAuthenticated) {
      const isAuthRequired =
        Boolean(item.allowedRoles && item.allowedRoles.length > 0) ||
        item.id === "profile" ||
        item.href.startsWith("/profile") ||
        item.id === "attempts-log" ||
        item.href.startsWith("/attempts") ||
        item.id === "results" ||
        item.href.startsWith("/results") ||
        item.id === "children-mgmt" ||
        item.id === "children-reports" ||
        item.id === "sub-status" ||
        item.id === "sub-history";
      return isAuthRequired;
    }
    return false;
  };

  const currentAvatarSrc =
    activeAccount?.type === "child"
      ? activeAccount.avatar ||
        (activeAccount.gender === "female"
          ? "/assets/girl_avatar.png"
          : "/assets/boy_avatar.png")
      : "/assets/user_avatar.png";

  const parentName =
    activeAccount?.rawParent?.name || (isParentRole ? "ولي الأمر" : "المستخدم");
  const isParentStatusActive =
    !activeAccount?.rawParent?.status ||
    activeAccount?.rawParent?.status === "active";
  const parentStatusLabel = isParentStatusActive ? "نشط" : "معطل";

  const hasMultipleProfiles = isParentRole || children.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />

          {/* Side Menu Drawer Panel */}
          <motion.aside
            dir="rtl"
            aria-label="القائمة الجانبية"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={isOpen ? DRAWER_SPRING : DRAWER_EXIT}
            className="fixed top-0 bottom-0 right-0 z-50 flex w-80 sm:w-90 rounded-tl-4xl rounded-bl-4xl flex-col bg-white shadow-[0_0_60px_rgba(0,0,0,0.25)] overflow-hidden will-change-transform"
          >
            {/* Side Menu Header (Purple Card Top) */}
            <div className="relative bg-mad-main px-6 py-5 text-white shrink-0 shadow-md">
              <div className="flex items-center justify-between">
                {/* Logo + Subtitle Text */}
                <div className="flex flex-col text-right">
                  <h2 className="text-lg font-extrabold text-white leading-tight flex items-center gap-1.5">
                    <Sparkles className="size-4 text-amber-300" />
                    <span>مدارك القراءة</span>
                  </h2>
                  <span className="mt-0.5 text-xs font-normal text-white/80">
                    منصة تعليمية عربية للأطفال
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  aria-label="إغلاق القائمة"
                  className="flex size-9 items-center justify-center rounded-full cursor-pointer bg-white/20 text-white transition-colors hover:bg-white/30 active:scale-95"
                >
                  <X className="size-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Scrollable Container (Account Switcher + Nav Items) */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100/80">
              {/* =========================================================
                  ACCOUNT / LOGIN SWITCHER SECTION (Mobile & Desktop)
                 ========================================================= */}
              {status === "loading" ? (
                <div className="p-4">
                  <div className="h-16 w-full bg-purple-50 animate-pulse rounded-2xl border border-purple-100" />
                </div>
              ) : isAuthenticated && activeAccount ? (
                <div className="p-4 bg-gradient-to-b from-purple-50/50 to-white">
                  {/* Current Active Account Header / Trigger Card */}
                  <div
                    onClick={() => {
                      if (hasMultipleProfiles) {
                        setIsSwitcherOpen((prev) => !prev);
                      }
                    }}
                    className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      hasMultipleProfiles
                        ? "bg-white border-purple-200/80 shadow-xs hover:border-mad-main hover:shadow-sm cursor-pointer"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative size-12 rounded-full overflow-hidden border-2 border-mad-main/30 shrink-0 bg-purple-50 p-0.5">
                        <Image
                          src={currentAvatarSrc}
                          alt={activeAccount.name}
                          width={48}
                          height={48}
                          className="size-full object-cover rounded-full"
                        />
                        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>

                      <div className="flex flex-col text-right overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 text-sm truncate">
                            {activeAccount.name}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mad-main/10 text-mad-main shrink-0">
                            نشط
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium truncate mt-0.5">
                          {activeAccount.type === "child"
                            ? `طفل (${activeChildBadges} أوسمة)`
                            : isStudent
                            ? "حساب طالب"
                            : "الحساب الرئيسي (ولي الأمر)"}
                        </span>
                      </div>
                    </div>

                    {/* Switcher Toggle Indicator */}
                    {hasMultipleProfiles && (
                      <div className="flex items-center gap-1 text-xs font-bold text-mad-main bg-purple-50 px-2.5 py-1.5 rounded-xl shrink-0 border border-purple-100">
                        <Users className="size-3.5" />
                        <span>تبديل</span>
                        {isSwitcherOpen ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expandable Switcher Profiles List */}
                  <AnimatePresence>
                    {hasMultipleProfiles && isSwitcherOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden mt-3 pt-3 border-t border-purple-100 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between px-1 mb-1">
                          <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                            <Users className="size-3.5 text-mad-main" />
                            <span>تبديل الحساب كـ</span>
                          </span>
                          <span className="text-[11px] font-semibold text-gray-400">
                            {children.length + 1} حسابات
                          </span>
                        </div>

                        {/* 1. Parent Profile Row */}
                        <button
                          type="button"
                          disabled={!isParentStatusActive}
                          onClick={() => {
                            if (isParentStatusActive) {
                              switchAccount("parent");
                              setIsSwitcherOpen(false);
                            }
                          }}
                          className={`w-full p-2.5 rounded-2xl transition-all border text-right flex items-center justify-between gap-3 ${
                            activeId === "parent"
                              ? "bg-purple-50/90 border-mad-main shadow-xs ring-1 ring-mad-main/30 cursor-pointer"
                              : !isParentStatusActive
                              ? "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"
                              : "bg-white border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="size-10 rounded-full ring-2 ring-purple-600 p-0.5 overflow-hidden shrink-0 bg-purple-50">
                              <Image
                                src="/assets/user_avatar.png"
                                alt={parentName}
                                width={40}
                                height={40}
                                className="size-full object-cover rounded-full"
                              />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-bold text-gray-900 text-xs truncate">
                                {parentName}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">
                                ولي الأمر (الرئيسي)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isParentStatusActive
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {parentStatusLabel}
                            </span>
                            {activeId === "parent" && (
                              <div className="size-5 rounded-full bg-mad-main text-white flex items-center justify-center">
                                <Check className="size-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        </button>

                        {/* 2. Children Profile Rows */}
                        {children.map((child, index) => {
                          const isSelected = activeId === child.id;
                          const isActive =
                            !child.status || child.status === "active";
                          const statusLabel = isActive ? "نشط" : "معطل";
                          const badges = resolveChildBadgesCount(child);
                          const avatarSrc =
                            child.avatar_img ||
                            child.avatar ||
                            (child.gender === "female"
                              ? "/assets/girl_avatar.png"
                              : "/assets/boy_avatar.png");
                          const ringColor =
                            index % 3 === 0
                              ? "ring-blue-500"
                              : index % 3 === 1
                              ? "ring-pink-500"
                              : "ring-purple-400";

                          return (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => {
                                if (isActive) {
                                  switchAccount(child.id, child.user_type);
                                  setIsSwitcherOpen(false);
                                }
                              }}
                              disabled={!isActive}
                              className={`w-full p-2.5 rounded-2xl transition-all border text-right flex items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-purple-50/90 border-mad-main shadow-xs ring-1 ring-mad-main/30 cursor-pointer"
                                  : !isActive
                                  ? "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"
                                  : "bg-white border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 cursor-pointer"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div
                                  className={`size-10 rounded-full ring-2 ${ringColor} p-0.5 overflow-hidden shrink-0 bg-purple-50`}
                                >
                                  <Image
                                    src={avatarSrc}
                                    alt={child.name}
                                    width={40}
                                    height={40}
                                    className="size-full object-cover rounded-full"
                                  />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                  <span
                                    className={`font-bold text-xs truncate ${
                                      !isActive ? "text-gray-500" : "text-gray-900"
                                    }`}
                                  >
                                    {child.name}
                                  </span>
                                  <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                                    <Award className="size-3 text-amber-500" />
                                    <span>{badges} وسام</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    isActive
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {statusLabel}
                                </span>
                                {isSelected && (
                                  <div className="size-5 rounded-full bg-mad-main text-white flex items-center justify-center">
                                    <Check className="size-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}

                        {/* 3. Add Child Quick Link */}
                        <Link
                          href="/parents/childMangement/addChild"
                          onClick={onClose}
                          className="w-full py-2 px-3 rounded-xl border border-dashed border-purple-300 hover:border-mad-main hover:bg-purple-50/50 text-mad-main font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-1 cursor-pointer"
                        >
                          <UserPlus className="size-3.5" />
                          <span>إضافة طفل جديد</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}

              {/* Side Menu Categories Navigation List */}
              <div className="py-2">
                <nav className="flex flex-col">
                  {visibleMenuItems.map((item, i) => {
                    const isActive = isItemActive(item.href);
                    const isDisabled = isItemDisabled(item);
                    const itemDelay = i * 0.035 + 0.02;

                    if (isDisabled) {
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: itemDelay,
                            duration: 0.28,
                            ease: "easeOut",
                          }}
                        >
                          <div
                            aria-disabled="true"
                            title="يتطلب تسجيل الدخول"
                            className="flex items-center justify-between px-6 py-3 text-right text-sm font-medium text-gray-400 opacity-60 cursor-not-allowed select-none transition-all"
                          >
                            <span>{item.label}</span>
                            <Lock className="size-4 text-gray-400/80 shrink-0" />
                          </div>
                        </motion.div>
                      );
                    }

                    const itemContent = (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: itemDelay,
                          duration: 0.28,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={createAccountHref(item.href)}
                          onClick={() => {
                            if (onSelectCategory) onSelectCategory(item.id);
                            onClose();
                          }}
                          className={`flex items-center justify-between px-6 py-3 text-right text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-purple-100/70 text-mad-main font-bold border-r-4 border-r-mad-main"
                              : "text-gray-700 hover:bg-purple-50/60 hover:text-mad-main"
                          }`}
                        >
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );

                    if (isAuthenticated && item.allowedRoles && item.allowedRoles.length > 0) {
                      return (
                        <RoleGuard
                          key={item.id}
                          allowedRoles={item.allowedRoles}
                          fallback={null}
                        >
                          {itemContent}
                        </RoleGuard>
                      );
                    }

                    return itemContent;
                  })}
                </nav>
              </div>
            </div>

            {/* Mobile Auth Action Buttons (Bottom of Side Menu) */}
            <div className="shrink-0 border-t border-gray-100 p-4 bg-gray-50/50 flex flex-col gap-2.5">
              {status === "loading" ? (
                <div className="h-11 w-full bg-gray-200 animate-pulse rounded-xl" />
              ) : isAuthenticated && activeAccount ? (
                <div className="flex flex-col gap-2">
                  {/* Profile Page Link - Parent only */}
                  {isParentActive && !isChildOrStudent && (
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-purple-50 text-gray-700 hover:text-mad-main font-bold text-center text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-gray-200 hover:border-purple-200 shadow-xs"
                    >
                      <User className="size-4 text-mad-main" />
                      <span>الملف الشخصي</span>
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetAccount();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-center text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer border border-red-200 shadow-xs"
                  >
                    <LogOut className="size-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-xl bg-mad-main text-white font-bold text-center text-sm shadow-md transition-all hover:bg-mad-main/90 active:scale-95"
                  >
                    إنشاء حساب
                  </Link>

                  <Link
                    href="/login"
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-xl border border-mad-main text-mad-main font-bold text-center text-sm transition-all hover:bg-mad-main/5 active:scale-95"
                  >
                    تسجيل الدخول
                  </Link>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;
