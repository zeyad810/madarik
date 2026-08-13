"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DESKTOP_NAV_LINKS } from "./constants";
import UserDropdown from "./UserDropdown";

const DesktopNav: React.FC = () => {
  const { status } = useSession();

  return (
    <>
      {/* Center Navigation Links */}
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

      {/* Auth Action Buttons (Desktop) */}
      <div className="hidden lg:flex items-center gap-4">
        {status === "loading" ? (
          <div className="h-10 w-32 bg-white/20 animate-pulse rounded-full" />
        ) : status === "authenticated" ? (
          <UserDropdown />
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default DesktopNav;

