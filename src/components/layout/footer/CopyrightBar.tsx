import React from "react";
import Link from "next/link";
import { DEFAULT_COPYRIGHT } from "./constants";

interface CopyrightBarProps {
  copyrightText?: string;
}

const CopyrightBar: React.FC<CopyrightBarProps> = ({
  copyrightText = DEFAULT_COPYRIGHT,
}) => {
  return (
    <div className="w-full border-t border-white/30 pt-6 mt-8 sm:mt-12">
      <div className="flex flex-col items-center justify-center text-center gap-3">
        {/* Legal Links (Visible on Mobile ONLY - sm:hidden) */}
        <div className="flex flex-col items-center justify-center gap-2 text-xs font-semibold text-white/90 sm:hidden">
          <Link href="/privacy" className="hover:text-white transition-colors">
            سياسة الخصوصية
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            شروط الاستخدام
          </Link>
        </div>

        {/* Copyright notice */}
        <p className="text-xs sm:text-sm font-medium text-white/90">
          {copyrightText}
        </p>
      </div>
    </div>
  );
};

export default CopyrightBar;
