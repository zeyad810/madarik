"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Search, LogOut, User } from "lucide-react";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { useParentChildren } from "@/features/parent/hooks/useParentChildren";
import { resolveChildBadgesCount } from "@/lib/children";
import { NotificationDropdown } from "@/features/notifications";
import { clearStoredAuth } from "@/lib/auth";

interface UserDropdownProps {
  onOpenSearch?: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ onOpenSearch }) => {
  const {
    activeId,
    activeAccount,
    switchAccount,
    children: sessionChildren,
    isParentRole,
    isParentActive,
    isChildOrStudent,
    resetAccount,
    parentName: hookParentName,
  } = useActiveAccount();
  const { children: parentChildren } = useParentChildren();

  const children =
    parentChildren && parentChildren.length > 0
      ? parentChildren
      : sessionChildren;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const parentName =
    hookParentName ||
    activeAccount?.rawParent?.name ||
    (isParentActive &&
    activeAccount?.name &&
    activeAccount.name !== "المستخدم" &&
    activeAccount.name !== "ولي الأمر"
      ? activeAccount.name
      : "") ||
    "ولي الأمر";
  const isParentStatusActive = !activeAccount?.rawParent?.status || activeAccount?.rawParent?.status === "active";
  const parentStatusLabel = isParentStatusActive ? "نشط" : "معطل";

  // Active avatar for the header button
  const currentAvatarSrc =
    activeAccount?.type === "child"
      ? activeAccount.avatar ||
      (activeAccount.gender === "female"
        ? "/assets/girl_avatar.png"
        : "/assets/boy_avatar.png")
      : "/assets/user_avatar.png";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3" dir="rtl">
      {/* 1. Search Button */}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="البحث"
        className="flex size-10 items-center justify-center rounded-full bg-white text-mad-main shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
      >
        <Search className="size-5 stroke-[2.2]" />
      </button>

      {/* 2. Notification Bell Dropdown */}
      <NotificationDropdown />

      {/* 3. Avatar Button & Dropdown Container */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="قائمة المستخدم"
          aria-expanded={isOpen}
          className="relative size-10.5 rounded-full bg-white/20 p-0.5 shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-white/80 overflow-hidden shrink-0"
        >
          <Image
            src={currentAvatarSrc}
            alt={activeAccount?.name || "المستخدم"}
            width={42}
            height={42}
            className="size-full object-cover rounded-full"
          />
        </button>

        {/* ================= Dropdown Menu Panel ================= */}
        {isOpen && (
          <div
            dir="rtl"
            className="absolute top-full left-0 mt-3 w-80 bg-white rounded-[28px] shadow-2xl border border-gray-100 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-right select-none"
          >
            {/* Parent Row */}
            <button
              type="button"
              disabled={!isParentStatusActive}
              onClick={() => {
                if (isParentStatusActive) {
                  switchAccount("parent");
                  setIsOpen(false);
                }
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all border text-right ${
                activeId === "parent"
                  ? "bg-[#F7F5FF] border-[#A855F7]/40 shadow-xs cursor-pointer"
                  : !isParentStatusActive
                  ? "border-transparent bg-gray-50 opacity-50 cursor-not-allowed"
                  : "border-transparent hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full ring-2 ring-purple-600 p-0.5 overflow-hidden shrink-0 bg-purple-50">
                  <Image
                    src="/assets/user_avatar.png"
                    alt={parentName}
                    width={48}
                    height={48}
                    className="size-full object-cover rounded-full"
                  />
                </div>
                <span className="font-bold text-gray-900 text-base truncate">
                  {parentName}
                </span>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isParentStatusActive
                    ? "bg-[#DCFCE7] text-[#16A34A]"
                    : "bg-[#F3F4F6] text-[#9CA3AF]"
                }`}
              >
                {parentStatusLabel}
              </span>
            </button>

            {/* Children Rows */}
            {children.length > 0 ? (
              children.map((child, index) => {
                const isSelected = activeId === child.id;
                const isActive = !child.status || child.status === "active";
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
                  <React.Fragment key={child.id}>
                    <div className="my-1" />

                    <button
                      type="button"
                      disabled={!isActive}
                      onClick={() => {
                        if (isActive) {
                          switchAccount(child.id, child.user_type);
                          setIsOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all border text-right ${
                        isSelected
                          ? "bg-[#F7F5FF] border-[#A855F7]/40 shadow-xs cursor-pointer"
                          : !isActive
                          ? "border-transparent bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-transparent hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-12 rounded-full ring-2 ${ringColor} p-0.5 overflow-hidden shrink-0 bg-purple-50`}
                        >
                          <Image
                            src={avatarSrc}
                            alt={child.name}
                            width={48}
                            height={48}
                            className="size-full object-cover rounded-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`font-bold text-base ${
                              !isActive ? "text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {child.name}
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              !isActive ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            عدد الاوسمة : {badges}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          isActive
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : "bg-[#F3F4F6] text-[#9CA3AF]"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </button>
                  </React.Fragment>
                );
              })
            ) : null}

            {/* Bottom Divider & Edit Profile Link (Parent only) */}
            {isParentActive && !isChildOrStudent ? (
              <>
                <div className="border-b border-gray-100 my-1 mx-2" />
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:text-mad-main font-bold text-sm hover:bg-purple-50/60 rounded-2xl transition-all cursor-pointer mb-1"
                >
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-gray-500" />
                    <span>الملف الشخصي</span>
                  </div>
                </Link>
              </>
            ) : (
              <div className="border-b border-gray-100 my-1 mx-2" />
            )}

            {/* Logout Action */}
            <button
              onClick={() => {
                setIsOpen(false);
                resetAccount();
                clearStoredAuth();
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-[#EF4444] hover:text-[#DC2626] font-bold text-base hover:bg-red-50/60 rounded-2xl transition-all cursor-pointer active:scale-95"
            >
              <LogOut className="size-5 text-[#EF4444]" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;
