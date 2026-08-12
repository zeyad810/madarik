import React from "react";
import { Search, X } from "lucide-react";

interface MobileSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClose,
}) => {
  return (
    <div className="mt-3 w-full animate-in fade-in slide-in-from-top-2 lg:hidden">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md">
          <Search className="size-5 text-mad-main shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن قصص، دروس، أو تقارير..."
            className="w-full bg-transparent text-sm font-medium text-gray-800 focus:outline-none placeholder-gray-400"
            autoFocus
          />
          <button
            onClick={onClose}
            aria-label="إغلاق البحث"
            className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBar;
