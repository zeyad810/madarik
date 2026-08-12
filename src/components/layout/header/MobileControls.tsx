import React from "react";
import { Menu, Search } from "lucide-react";

interface MobileControlsProps {
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  onOpenMenu: () => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  onToggleSearch,
  onOpenMenu,
}) => {
  return (
    <div className="flex lg:hidden items-center gap-3">
      {/* Mobile Search Button (White Circle) */}
      <button
        onClick={onToggleSearch}
        aria-label="بحث"
        className="flex size-10 items-center justify-center cursor-pointer rounded-full bg-white text-mad-main shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        <Search className="size-5" strokeWidth={2.5} />
      </button>

      {/* Mobile Menu Toggle Button (White Circle next to Search icon) */}
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
