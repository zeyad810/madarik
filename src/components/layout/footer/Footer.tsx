"use client";

import React from "react";
import Newsletter from "./Newsletter";
import BrandSection from "./BrandSection";
import FooterNav from "./FooterNav";
import ContactSection from "./ContactSection";
import CopyrightBar from "./CopyrightBar";
import { FooterProps } from "./types";
import {
  DEFAULT_NEWSLETTER,
  DEFAULT_BRAND_DESCRIPTION,
  DEFAULT_QUICK_LINKS,
  DEFAULT_IMPORTANT_LINKS,
  DEFAULT_CONTACT_INFO,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_COPYRIGHT,
} from "./constants";

const Footer: React.FC<FooterProps> = ({
  newsletter = DEFAULT_NEWSLETTER,
  onSubscribe,
  brandDescription = DEFAULT_BRAND_DESCRIPTION,
  quickLinks = DEFAULT_QUICK_LINKS,
  importantLinks = DEFAULT_IMPORTANT_LINKS,
  contactInfo = DEFAULT_CONTACT_INFO,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  copyrightText = DEFAULT_COPYRIGHT,
  bgImageSrc = "/iamges/FooterBg.png",
}) => {
  return (
    <footer
      dir="rtl"
      className="w-full bg-no-repeat text-white pt-28 sm:pt-40 md:pt-48 lg:pt-56 pb-8 sm:pb-12 min-h-[620px] md:min-h-[780px] lg:min-h-[950px] xl:min-h-[1100px] flex flex-col justify-between relative overflow-hidden"
      style={{
        backgroundImage: `url('${bgImageSrc}')`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center top",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-end flex-1">
        {/* ==========================================
            1. NEWSLETTER SECTION
           ========================================== */}
        <Newsletter data={newsletter} onSubscribe={onSubscribe} />

        {/* ==========================================
            2. MAIN FOOTER CONTENT GRID
           ========================================== */}
        <div className="mt-12 sm:mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-6 sm:pb-8">
          {/* Brand & Logo Column (Desktop: 4 cols, Mobile: full) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <BrandSection
              description={brandDescription}
              socialLinks={socialLinks}
            />
          </div>

          {/* Nav Links Columns (Quick & Important Links: 5 cols) */}
          <div className="sm:col-span-1 lg:col-span-5 grid grid-cols-2 gap-6">
            <FooterNav
              quickLinks={quickLinks}
              importantLinks={importantLinks}
            />
          </div>

          {/* Contact Us Column (3 cols) */}
          <div className="sm:col-span-1 lg:col-span-3">
            <ContactSection contactInfo={contactInfo} />
          </div>
        </div>

        {/* ==========================================
            3. COPYRIGHT BAR (Centered Text)
           ========================================== */}
        <CopyrightBar copyrightText={copyrightText} />
      </div>
    </footer>
  );
};

export default Footer;
