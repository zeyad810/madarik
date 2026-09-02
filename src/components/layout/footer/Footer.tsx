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
} from "./types";
import {
  DEFAULT_BRAND_DESCRIPTION,
  DEFAULT_QUICK_LINKS,
  DEFAULT_IMPORTANT_LINKS,
  DEFAULT_CONTACT_INFO,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_COPYRIGHT,
  DEFAULT_NEWSLETTER,
} from "./constants";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import { usePublicLanding } from "@/features/site/hooks/usePublicLanding";

const Footer: React.FC<FooterProps> = ({
  id = "footer",
  newsletter: propNewsletter,
  onSubscribe,
  brandDescription = DEFAULT_BRAND_DESCRIPTION,
  quickLinks: propQuickLinks,
  importantLinks = DEFAULT_IMPORTANT_LINKS,
  contactInfo: propContactInfo,
  socialLinks: propSocialLinks,
  copyrightText = DEFAULT_COPYRIGHT,
  bgImageSrc = "/iamges/FooterBg.png",
  mobileBgImageSrc = "/iamges/FooterBgMob.png",
}) => {
  const { userRole, isStudent, activeAccount } = useActiveAccount();
  const isChildOrStudent =
    isStudent ||
    userRole === "student" ||
    userRole === "child" ||
    activeAccount?.type === "child";

  const { data: landingData } = usePublicLanding();
  const apiNewsletter = landingData?.data?.newsletter_section;
  const apiContact = landingData?.data?.contact_section?.contact_info;
  const apiSocial = landingData?.data?.contact_section?.social_media;

  const newsletter = React.useMemo(() => {
    if (propNewsletter) return propNewsletter;
    if (apiNewsletter) {
      return {
        title: apiNewsletter.title || DEFAULT_NEWSLETTER.title,
        description: apiNewsletter.subtitle || DEFAULT_NEWSLETTER.description,
        placeholder: DEFAULT_NEWSLETTER.placeholder,
      };
    }
    return DEFAULT_NEWSLETTER;
  }, [propNewsletter, apiNewsletter]);

  const contactInfo = React.useMemo(() => {
    if (propContactInfo) return propContactInfo;
    if (apiContact) {
      return {
        email: apiContact.email || DEFAULT_CONTACT_INFO.email,
        phone: apiContact.phone || DEFAULT_CONTACT_INFO.phone,
        location: apiContact.address || DEFAULT_CONTACT_INFO.location,
      };
    }
    return DEFAULT_CONTACT_INFO;
  }, [propContactInfo, apiContact]);

  const socialLinks = React.useMemo(() => {
    if (propSocialLinks) return propSocialLinks;
    if (apiSocial) {
      return [
        { id: "instagram", name: "Instagram", href: apiSocial.instagram || DEFAULT_SOCIAL_LINKS[1].href, type: "instagram" as const },
        { id: "twitter", name: "Twitter", href: apiSocial.twitter || DEFAULT_SOCIAL_LINKS[2].href, type: "twitter" as const },
        { id: "facebook", name: "Facebook", href: apiSocial.facebook || DEFAULT_SOCIAL_LINKS[3].href, type: "facebook" as const },
      ];
    }
    return DEFAULT_SOCIAL_LINKS;
  }, [propSocialLinks, apiSocial]);

  const rawQuickLinks: FooterLinkItem[] =
    propQuickLinks ?? DEFAULT_QUICK_LINKS;

  const quickLinks: FooterLinkItem[] = React.useMemo(() => {
    if (!isChildOrStudent) return rawQuickLinks;
    return rawQuickLinks.filter(
      (l) =>
        l.id !== "pricing" &&
        l.id !== "packages" &&
        l.id !== "subscriptions" &&
        !l.href.includes("pricing") &&
        !l.href.includes("packages") &&
        !l.href.includes("subscriptions")
    );
  }, [rawQuickLinks, isChildOrStudent]);

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
        className="footer-responsive-bg w-full text-white pt-32 sm:pt-40 md:pt-48 lg:pt-56 pb-8 sm:pb-12 min-h-280 xl:min-h-287.5 flex flex-col justify-between relative overflow-hidden"
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
            {/* Brand & Logo Section */}
            <div className="w-full lg:col-span-4 flex flex-col items-center lg:items-start">
              <BrandSection
                description={brandDescription}
                socialLinks={socialLinks}
              />
            </div>

            {/* Mobile 2-Column Row / Desktop Columns */}
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
              3. COPYRIGHT BAR
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
