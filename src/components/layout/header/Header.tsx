"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import Logo from "./Logo";

// Side Menu Navigation Items
export interface SideMenuItem {
  id: string;
  label: string;
  href: string;
}

const SIDE_MENU_ITEMS: SideMenuItem[] = [
  { id: "home", label: "الرئيسية", href: "/" },
  { id: "available-stories", label: "القصص المتاحة", href: "/stories" },
  { id: "children-mgmt", label: "إدارة الأطفال", href: "/children" },
  { id: "children-reports", label: "تقارير الأطفال", href: "/reports" },
  { id: "attempts-log", label: "سجل المحاولات", href: "/attempts" },
  { id: "subscriptions", label: "الاشتراكات والدفع", href: "/subscriptions" },
  { id: "sub-status", label: "حالة اشتراكي", href: "/subscription-status" },
  { id: "profile", label: "الملف الشخصي", href: "/profile" },
];

// Desktop Main Nav Links
const DESKTOP_NAV_LINKS = [
  { id: "home", label: "الرئيسية", href: "/" },
  { id: "results", label: "نتائجي", href: "/results" },
  { id: "library", label: "مكتبة القصص", href: "/library" },
  { id: "contact", label: "تواصل معنا", href: "/contact" },
  { id: "faq", label: "الأسئلة الشائعة", href: "/faq" },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  // Disable body scroll when Side Menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Handle ESC key to close drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        dir="rtl"
        className="absolute top-0 left-0 right-0 z-40 w-full transition-all duration-300 py-4 px-4 sm:px-6 lg:px-12"
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* ==========================================
              1. RIGHT SIDE (Desktop & Mobile)
             ========================================== */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Desktop Side Menu Toggle Button (Burger Icon next to Logo) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="افتح القائمة الجانبية"
              className="hidden lg:flex items-center justify-center p-2 text-white hover:text-white/80 transition-colors focus:outline-none"
            >
              <Menu className="size-7" strokeWidth={2.2} />
            </button>

            {/* Logo Component */}
            <Logo />
          </div>

          {/* ==========================================
              2. CENTER NAVIGATION LINKS (Desktop only)
             ========================================== */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {DESKTOP_NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-white hover:text-white/80 font-semibold text-sm xl:text-base transition-colors relative py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ==========================================
              3. LEFT SIDE ACTIONS (Desktop & Mobile)
             ========================================== */}
          {/* Desktop Auth Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/register"
              className="rounded-full border border-white/90 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-white hover:text-mad-main active:scale-95 shadow-sm"
            >
              إنشاء حساب
            </Link>

            <Link
              href="/login"
              className="rounded-full px-5 py-2 text-sm font-bold text-white underline underline-offset-4 transition-all hover:text-white/80 active:scale-95"
            >
              تسجيل الدخول
            </Link>
          </div>

          {/* Mobile / Responsive Controls (Icons on the Left side in RTL) */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Search Button (White Circle) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="بحث"
              className="flex size-10 items-center justify-center rounded-full bg-white text-mad-main shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <Search className="size-5" strokeWidth={2.5} />
            </button>

            {/* Mobile Menu Toggle Button (White Circle next to Search icon) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="افتح القائمة"
              className="flex size-10 items-center justify-center rounded-full bg-white text-mad-main shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <Menu className="size-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ==========================================
            4. MOBILE EXPANDABLE SEARCH BAR
           ========================================== */}
        {isSearchOpen && (
          <div className="mt-3 w-full animate-in fade-in slide-in-from-top-2 lg:hidden">
            <div className="container mx-auto">
              <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md">
                <Search className="size-5 text-mad-main shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن قصص، دروس، أو تقارير..."
                  className="w-full bg-transparent text-sm font-medium text-gray-800 focus:outline-none placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ==========================================
          5. SIDE MENU OVERLAY & DRAWER
         ========================================== */}
      {/* Backdrop */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        />
      )}

      {/* Side Menu Drawer Panel */}
      <aside
        dir="rtl"
        aria-label="القائمة الجانبية"
        className={`fixed top-0 bottom-0 right-0 z-50 flex w-[300px] sm:w-[330px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Side Menu Header (Purple Card Top) */}
        <div className="relative bg-mad-main px-6 py-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            {/* Logo + Subtitle */}
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
              onClick={() => setIsMenuOpen(false)}
              aria-label="إغلاق القائمة"
              className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 active:scale-95"
            >
              <X className="size-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Side Menu Categories List */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="flex flex-col">
            {SIDE_MENU_ITEMS.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveCategory(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-6 py-4 text-right text-sm font-semibold transition-all border-b border-gray-100/70 ${
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
      </aside>
    </>
  );
};

export default Header;