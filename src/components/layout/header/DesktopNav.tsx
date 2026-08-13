"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { DESKTOP_NAV_LINKS } from "./constants";

const DesktopNav: React.FC = () => {
  const { data: session, status } = useSession();

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
          <div className="h-9 w-28 bg-white/20 animate-pulse rounded-full" />
        ) : status === "authenticated" ? (
          <div className="flex items-center gap-3">
            {session?.user?.name && (
              <div className="flex items-center gap-2 text-white font-medium text-sm bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                <User className="size-4 text-white/80" />
                <span>{session.user.name}</span>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 rounded-full border border-white/90 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white hover:text-mad-main active:scale-95 shadow-sm cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
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

