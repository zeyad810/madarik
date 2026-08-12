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
      className="w-full bg-cover bg-top bg-no-repeat text-white pt-24 pb-8 sm:pt-32 sm:pb-12 relative overflow-hidden"
      style={{
        backgroundImage: `url('${bgImageSrc}')`,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==========================================
            1. NEWSLETTER SECTION
           ========================================== */}
        <Newsletter data={newsletter} onSubscribe={onSubscribe} />

        {/* ==========================================
            2. MAIN FOOTER CONTENT GRID
           ========================================== */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-6 sm:pb-8">
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
            3. COPYRIGHT BAR
           ========================================== */}
        <CopyrightBar copyrightText={copyrightText} />
      </div>
    </footer>
  );
};

export default Footer;
