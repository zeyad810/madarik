import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AttemptsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AttemptsPagination: React.FC<AttemptsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pt-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
      >
        <ChevronRight className="size-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`size-8 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
            currentPage === page
              ? "bg-mad-third text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
      >
        <ChevronLeft className="size-4" />
      </button>
    </div>
  );
};
