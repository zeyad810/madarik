"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { DESKTOP_NAV_LINKS } from "./constants";
import UserDropdown from "./UserDropdown";
import { useActiveAccount } from "@/hooks/useActiveAccount";

import { Search } from "lucide-react";

interface DesktopNavProps {
  onOpenSearch?: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ onOpenSearch }) => {
  const pathname = usePathname();
  const { status } = useSession();
  const {
    createAccountHref,
    userRole,
    isStudent,
    isFreeCustomer,
    isAuthenticated,
    activeAccount,
    activeChild,
  } = useActiveAccount();

  const isChildOrStudent =
    isStudent ||
    userRole === "student" ||
    userRole === "child" ||
    activeAccount?.type === "child" ||
    activeChild !== null;

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const visibleNavLinks = React.useMemo(() => {
    // For unauthenticated visitors, show all navigation links
    if (!isAuthenticated) {
      return DESKTOP_NAV_LINKS;
    }

    return DESKTOP_NAV_LINKS.filter((link) => {
      // 1. Packages / Subscriptions links: hidden from child & student
      const isPackagesLink =
        link.id === "packages" ||
        link.id === "pricing" ||
        link.id === "subscriptions" ||
        link.href.startsWith("/packages") ||
        link.href.startsWith("/subscriptions") ||
        link.href.startsWith("/subscription-status");

      if (isPackagesLink && isChildOrStudent) {
        return false;
      }

      // 2. Results link ("نتائجي") is strictly for authenticated student, parent, child
      // and NEVER for free_customer
      const isResultsLink =
        link.id === "results" ||
        link.href.startsWith("/results") ||
        link.href.startsWith("/attempts");

      if (isResultsLink) {
        if (isFreeCustomer) {
          return false;
        }
        const hasHistoryRole =
          userRole === "student" || userRole === "parent" || userRole === "child";
        if (!hasHistoryRole) {
          return false;
        }
      }

      return true;
    });
  }, [isAuthenticated, isFreeCustomer, isChildOrStudent, userRole]);

  const isNavLinkDisabled = (link: (typeof DESKTOP_NAV_LINKS)[number]) => {
    if (!isAuthenticated) {
      const isAuthRequired =
        link.id === "results" ||
        link.href.startsWith("/results") ||
        link.href.startsWith("/attempts") ||
        link.id === "profile" ||
        link.href.startsWith("/profile") ||
        Boolean(link.allowedRoles && link.allowedRoles.length > 0);
      return isAuthRequired;
    }
    return false;
  };

  return (
    <>
      {/* Center Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        {visibleNavLinks.map((link) => {
          const isActive = isLinkActive(link.href);
          const isDisabled = isNavLinkDisabled(link);

          if (isDisabled) {
            return (
              <span
                key={link.id}
                aria-disabled="true"
                title="يتطلب تسجيل الدخول"
                className="font-semibold text-sm xl:text-base text-white/40 cursor-not-allowed select-none py-1 transition-opacity"
              >
                {link.label}
              </span>
            );
          }

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
          <UserDropdown onOpenSearch={onOpenSearch} />
        ) : (
          <>
            {/* Desktop Visitor Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="البحث عن القصص"
              className="flex size-10 items-center justify-center rounded-full bg-white text-mad-main shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Search className="size-5 stroke-[2.2]" />
            </button>

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

