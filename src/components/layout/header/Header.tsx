"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileControls from "./MobileControls";
import SideMenu from "./SideMenu";
import HeaderSearchModal from "./HeaderSearchModal";

const Header: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for sticky header styling across all pages
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Disable body scroll when Side Menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isSearchOpen) {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isSearchOpen]);

  // Global Keyboard shortcuts: ESC to close, Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Header Container */}
      <header
        dir="rtl"
        className={
          isHomePage
            ? `fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 px-4 sm:px-6 lg:px-12 ${
                isScrolled
                  ? "bg-mad-main/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10"
                  : "bg-transparent py-4 sm:py-5"
              }`
            : `sticky top-0 left-0 right-0 z-40 w-full transition-all duration-300 px-4 sm:px-6 lg:px-12 ${
                isScrolled
                  ? "bg-mad-main/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10"
                  : "bg-mad-main py-3.5 sm:py-4 shadow-none border-b border-transparent"
              }`
        }
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* ==========================================
              1. RIGHT SIDE: Burger + Logo
             ========================================== */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Desktop Side Menu Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="افتح القائمة الجانبية"
              className="hidden lg:flex items-center justify-center p-2 cursor-pointer text-white hover:text-white/80 transition-colors focus:outline-none"
            >
              <Menu className="size-7" strokeWidth={2.2} />
            </button>

            {/* Logo Component */}
            <Logo loading="eager" />
          </div>

          {/* ==========================================
              2. DESKTOP NAV LINKS & AUTH BUTTONS
             ========================================== */}
          <DesktopNav onOpenSearch={() => setIsSearchOpen(true)} />

          {/* ==========================================
              3. MOBILE CONTROLS (Search & Menu Icons)
             ========================================== */}
          <MobileControls
            isSearchOpen={isSearchOpen}
            onToggleSearch={() => setIsSearchOpen(true)}
            onOpenMenu={() => setIsMenuOpen(true)}
          />
        </div>
      </header>

      {/* ==========================================
          4. INTERACTIVE SEARCH MODAL (Desktop & Mobile)
         ========================================== */}
      <HeaderSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* ==========================================
          5. SIDE MENU DRAWER (Mobile & Desktop)
         ========================================== */}
      <SideMenu
        isOpen={isMenuOpen}
        activeCategory={activeCategory}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={setActiveCategory}
      />
    </>
  );
};

export default Header;