import React from "react";
import Link from "next/link";
import { FooterLinkItem } from "./types";
import { DEFAULT_QUICK_LINKS, DEFAULT_IMPORTANT_LINKS } from "./constants";

interface FooterNavProps {
  quickLinks?: FooterLinkItem[];
  importantLinks?: FooterLinkItem[];
}

const FooterNav: React.FC<FooterNavProps> = ({
  quickLinks = DEFAULT_QUICK_LINKS,
  importantLinks = DEFAULT_IMPORTANT_LINKS,
}) => {
  return (
    <>
      {/* Quick Links Column */}
      <div className="flex flex-col items-start text-right">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
          روابط سريعة
        </h3>
        <ul className="flex flex-col gap-2.5">
          {quickLinks.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                className="text-xs sm:text-sm text-white/90 hover:text-white transition-colors py-0.5 block font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Important Links Column */}
      <div className="flex flex-col items-start text-right hidden lg:flex">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
          روابط هامة
        </h3>
        <ul className="flex flex-col gap-2.5">
          {importantLinks.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                className="text-xs sm:text-sm text-white/90 hover:text-white transition-colors py-0.5 block font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FooterNav;
