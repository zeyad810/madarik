"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { X, LogOut } from "lucide-react";
import { SIDE_MENU_ITEMS } from "./constants";

interface SideMenuProps {
  isOpen: boolean;
  activeCategory: string;
  onClose: () => void;
  onSelectCategory: (id: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  activeCategory,
  onClose,
  onSelectCategory,
}) => {
  const { data: session, status } = useSession();

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
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 bottom-0 right-0 z-50 flex w-75 sm:w-82.5 rounded-tl-[40px] rounded-bl-[40px] flex-col bg-white shadow-2xl overflow-hidden"
          >
            {/* Side Menu Header (Purple Card Top) */}
            <div
              className="relative bg-mad-main px-6 py-6 text-white shrink-0"
              style={{ borderTopLeftRadius: "32px" }}
            >
              <div className="flex items-center justify-between">
                {/* Logo + Subtitle Text */}
                <div className="flex flex-col text-right">
                  <h2 className="text-lg font-extrabold text-white leading-tight">
                    مدارك القراءة
                  </h2>
                  <span className="mt-0.5 text-xs font-normal text-white/80">
                    منصة تعليمية عربية
                  </span>
                </div>

                {/* Close Button (Translucent White Circle) */}
                <button
                  onClick={onClose}
                  aria-label="إغلاق القائمة"
                  className="flex size-9 items-center justify-center rounded-full cursor-pointer bg-white/20 text-white transition-colors hover:bg-white/30 active:scale-95"
                >
                  <X className="size-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Side Menu Categories List */}
            <div className="flex-1 overflow-y-auto">
              <nav className="flex flex-col">
                {SIDE_MENU_ITEMS.map((item) => {
                  const isActive = activeCategory === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        onSelectCategory(item.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between px-6 py-3.5 text-right text-sm font-semibold transition-all border-b border-gray-100/70 ${
                        isActive
                          ? "bg-[#F3E8FF] text-mad-main font-bold border-r-4 border-r-mad-main"
                          : "text-gray-700 hover:bg-purple-50/60 hover:text-mad-main"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Auth Action Buttons (Bottom of Side Menu) */}
            <div className="shrink-0 border-t border-gray-100 p-5 flex flex-col gap-3">
              {status === "loading" ? (
                <div className="h-11 w-full bg-gray-200 animate-pulse rounded-xl" />
              ) : status === "authenticated" ? (
                <div className="flex flex-col gap-3">
                  {/* Parent Profile Summary */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                    <div className="size-10 rounded-full overflow-hidden border border-mad-main/20 shrink-0">
                      <Image
                        src="/assets/user_avatar.png"
                        alt={session?.user?.name || "المستخدم"}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-gray-900 text-sm truncate">
                        {session?.user?.name || "ولي الأمر"}
                      </span>
                      <span className="text-[10px] text-mad-main font-semibold">
                        {session?.user?.children?.length || 0} أطفال مسجلون
                      </span>
                    </div>
                  </div>

                  {/* Logout Button at bottom */}
                  <button
                    onClick={() => {
                      onClose();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-center text-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer border border-red-200 mt-1"
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
