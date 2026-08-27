"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Menu, Search } from "lucide-react";
import { NotificationDropdown } from "@/features/notifications";

interface MobileControlsProps {
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  onOpenMenu: () => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  onToggleSearch,
  onOpenMenu,
}) => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="flex lg:hidden items-center gap-2.5">
      {/* Mobile Search Button */}
      <button
        onClick={onToggleSearch}
        aria-label="بحث"
        className="flex size-10 items-center justify-center cursor-pointer rounded-full bg-white text-mad-main shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        <Search className="size-5" strokeWidth={2.5} />
      </button>

      {/* Mobile Notification Dropdown (when authenticated) */}
      {isAuthenticated && <NotificationDropdown />}

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={onOpenMenu}
        aria-label="افتح القائمة"
        className="flex size-10 items-center justify-center cursor-pointer rounded-full bg-white text-mad-main shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        <Menu className="size-5" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default MobileControls;

