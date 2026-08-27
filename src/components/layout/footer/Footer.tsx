"use client";

import React from "react";
import { motion } from "framer-motion";
import Newsletter from "./Newsletter";
import BrandSection from "./BrandSection";
import FooterNav from "./FooterNav";
import ContactSection from "./ContactSection";
import CopyrightBar from "./CopyrightBar";
import {
  FooterProps,
  FooterLinkItem,
  ContactInfo,
  SocialLink,
} from "./types";
import {
  DEFAULT_BRAND_DESCRIPTION,
  DEFAULT_QUICK_LINKS,
  DEFAULT_IMPORTANT_LINKS,
  DEFAULT_CONTACT_INFO,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_COPYRIGHT,
} from "./constants";
import { usePublicLanding } from "@/features/site/hooks/usePublicLanding";

const Footer: React.FC<FooterProps> = ({
  id: propId,
  newsletter,
  onSubscribe,
  brandDescription: propBrandDescription,
  quickLinks: propQuickLinks,
  importantLinks: propImportantLinks,
  contactInfo: propContactInfo,
  socialLinks: propSocialLinks,
  copyrightText = DEFAULT_COPYRIGHT,
  bgImageSrc = "/iamges/FooterBg.png",
  mobileBgImageSrc = "/iamges/FooterBgMob.png",
}) => {
  const { data: footerData } = usePublicLanding({
    select: (res) => res.data?.footer_section,
  });
  const { data: contactData } = usePublicLanding({
    select: (res) => res.data?.contact_section,
  });

  const id = propId ?? footerData?.id;

  const brandDescription =
    propBrandDescription ??
    footerData?.description ??
    DEFAULT_BRAND_DESCRIPTION;

  const quickLinks: FooterLinkItem[] =
    propQuickLinks ??
    (footerData?.quick_links && footerData.quick_links.length > 0
      ? footerData.quick_links.map((link, idx) => ({
          id: link.url || `quick-${idx}`,
          label: link.label,
          href: link.url,
        }))
      : DEFAULT_QUICK_LINKS);

  const importantLinks: FooterLinkItem[] =
    propImportantLinks ??
    (footerData?.important_links && footerData.important_links.length > 0
      ? footerData.important_links.map((link, idx) => ({
          id: link.url || `imp-${idx}`,
          label: link.label,
          href: link.url,
        }))
      : DEFAULT_IMPORTANT_LINKS);

  const contactInfo: ContactInfo =
    propContactInfo ??
    (contactData?.contact_info
      ? {
          email: contactData.contact_info.email || DEFAULT_CONTACT_INFO.email,
          phone: contactData.contact_info.phone || DEFAULT_CONTACT_INFO.phone,
          location:
            contactData.contact_info.address || DEFAULT_CONTACT_INFO.location,
        }
      : DEFAULT_CONTACT_INFO);

  const socialLinks: SocialLink[] =
    propSocialLinks ??
    (() => {
      if (!contactData?.social_media) return DEFAULT_SOCIAL_LINKS;

      const dynamicLinks: SocialLink[] = [];
      if (contactData.social_media.linkedin) {
        dynamicLinks.push({
          id: "linkedin",
          name: "LinkedIn",
          href: contactData.social_media.linkedin,
          type: "linkedin",
        });
      }
      if (contactData.social_media.instagram) {
        dynamicLinks.push({
          id: "instagram",
          name: "Instagram",
          href: contactData.social_media.instagram,
          type: "instagram",
        });
      }
      if (contactData.social_media.twitter) {
        dynamicLinks.push({
          id: "twitter",
          name: "Twitter",
          href: contactData.social_media.twitter,
          type: "twitter",
        });
      }
      if (contactData.social_media.facebook) {
        dynamicLinks.push({
          id: "facebook",
          name: "Facebook",
          href: contactData.social_media.facebook,
          type: "facebook",
        });
      }

      return dynamicLinks.length > 0 ? dynamicLinks : DEFAULT_SOCIAL_LINKS;
    })();
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
        id={id}
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
          <CopyrightBar
            copyrightText={copyrightText}
            importantLinks={importantLinks}
          />
        </div>
      </footer>
    </>
  );
};

export default Footer;
