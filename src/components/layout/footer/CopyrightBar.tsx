import React from "react";
import Link from "next/link";
import { FooterLinkItem } from "./types";
import { DEFAULT_COPYRIGHT, DEFAULT_IMPORTANT_LINKS } from "./constants";

interface CopyrightBarProps {
  copyrightText?: string;
  importantLinks?: FooterLinkItem[];
}

const CopyrightBar: React.FC<CopyrightBarProps> = ({
  copyrightText = DEFAULT_COPYRIGHT,
  importantLinks = DEFAULT_IMPORTANT_LINKS,
}) => {
  return (
    <div className="w-full border-t border-white/30 pt-6 mt-8 sm:mt-12">
      <div className="flex flex-col items-center justify-center text-center gap-3">
        {/* Legal Links (Visible on Mobile ONLY - sm:hidden) */}
        {importantLinks && importantLinks.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-2 text-xs font-semibold text-white/90 sm:hidden">
            {importantLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Copyright notice */}
        <p className="text-xs sm:text-sm font-medium text-white/90">
          {copyrightText}
        </p>
      </div>
    </div>
  );
};

export default CopyrightBar;
