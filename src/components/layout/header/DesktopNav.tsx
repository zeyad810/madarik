"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { DESKTOP_NAV_LINKS } from "./constants";
import UserDropdown from "./UserDropdown";
import { useActiveAccount } from "@/hooks/useActiveAccount";

const DesktopNav: React.FC = () => {
  const pathname = usePathname();
  const { status } = useSession();
  const { createAccountHref, userRole, isStudent, isFreeCustomer, isAuthenticated } = useActiveAccount();

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const visibleNavLinks = React.useMemo(() => {
    return DESKTOP_NAV_LINKS.filter((link) => {
      const isResultsLink =
        link.id === "results" ||
        link.href.startsWith("/results") ||
        link.href.startsWith("/attempts");

      // Results link ("نتائجي") is strictly for authenticated student, parent, child
      // and NEVER for free_customer, visitor, or unauthenticated/loading state
      if (isResultsLink) {
        if (!isAuthenticated || isFreeCustomer) {
          return false;
        }
        const hasHistoryRole =
          userRole === "student" || userRole === "parent" || userRole === "child";
        if (!hasHistoryRole) {
          return false;
        }
      }

      if (isStudent) {
        return (
          link.id === "library" ||
          link.id === "results" ||
          link.href.startsWith("/stories") ||
          link.href.startsWith("/results")
        );
      }
      return true;
    });
  }, [isAuthenticated, isFreeCustomer, isStudent, userRole]);

  return (
    <>
      {/* Center Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        {visibleNavLinks.map((link) => {
          const isActive = isLinkActive(link.href);
          return (
            <Link
              key={link.id}
              href={createAccountHref(link.href)}
              className={`font-semibold text-sm xl:text-base transition-all relative py-1 ${
                isActive
                  ? "text-white font-bold underline underline-offset-8 decoration-2"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
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

