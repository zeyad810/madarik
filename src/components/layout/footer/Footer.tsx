"use client";

import React from "react";
import { motion } from "framer-motion";
import Newsletter from "./Newsletter";
import BrandSection from "./BrandSection";
import FooterNav from "./FooterNav";
import ContactSection from "./ContactSection";
import CopyrightBar from "./CopyrightBar";
import { FooterProps } from "./types";
import {
  DEFAULT_BRAND_DESCRIPTION,
  DEFAULT_QUICK_LINKS,
  DEFAULT_IMPORTANT_LINKS,
  DEFAULT_CONTACT_INFO,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_COPYRIGHT,
} from "./constants";

const Footer: React.FC<FooterProps> = ({
  newsletter,
  onSubscribe,
  brandDescription = DEFAULT_BRAND_DESCRIPTION,
  quickLinks = DEFAULT_QUICK_LINKS,
  importantLinks = DEFAULT_IMPORTANT_LINKS,
  contactInfo = DEFAULT_CONTACT_INFO,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  copyrightText = DEFAULT_COPYRIGHT,
  bgImageSrc = "/iamges/FooterBg.png",
  mobileBgImageSrc = "/iamges/FooterBgMob.png",
}) => {
  return (
    <>
      <style>{`
        .footer-responsive-bg {
          background-image: url('${mobileBgImageSrc}');
          background-size: 100% 100%;
          background-position: center top;
          background-repeat: no-repeat;
        }
        @media (min-width: 640px) {
          .footer-responsive-bg {
            background-image: url('${bgImageSrc}');
          }
        }
      `}</style>
      <footer
        dir="rtl"
        className="footer-responsive-bg w-full text-white pt-32 sm:pt-40 md:pt-48 lg:pt-56 pb-8 sm:pb-12 min-h-245 xl:min-h-287.5 flex flex-col justify-between relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-end flex-1">
          {/* ==========================================
              1. NEWSLETTER SECTION
             ========================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Newsletter data={newsletter} onSubscribe={onSubscribe} />
          </motion.div>

          {/* ==========================================
              2. MAIN FOOTER CONTENT GRID
             ========================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-10 sm:mt-16 lg:mt-24 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10 pb-6 sm:pb-8"
          >
            {/* Brand & Logo Section (Centered on Mobile, Left-aligned column on Desktop) */}
            <div className="w-full lg:col-span-4 flex flex-col items-center lg:items-start">
              <BrandSection
                description={brandDescription}
                socialLinks={socialLinks}
              />
            </div>

            {/* Mobile 2-Column Row (روابط سريعة | تواصل معنا) / Desktop Columns */}
            <div className="w-full lg:col-span-8 grid grid-cols-2 lg:grid-cols-8 gap-6 sm:gap-8">
              <div className="lg:col-span-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FooterNav
                  quickLinks={quickLinks}
                  importantLinks={importantLinks}
                />
              </div>
              <div className="lg:col-span-3">
                <ContactSection contactInfo={contactInfo} />
              </div>
            </div>
          </motion.div>

          {/* ==========================================
              3. COPYRIGHT BAR (Legal links on mobile ONLY + Centered Text)
             ========================================== */}
          <CopyrightBar copyrightText={copyrightText} />
        </div>
      </footer>
    </>
  );
};

export default Footer;
