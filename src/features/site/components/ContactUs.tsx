"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactFormCard } from "./ContactFormCard";
import { InstagramIcon, TwitterIcon, FacebookIcon } from "./ContactIcons";
import { usePublicLanding } from "../hooks/usePublicLanding";
import { defaultContactData } from "./contactData";
import type { ContactUsProps } from "../types";

const ContactUs: React.FC<ContactUsProps> = ({
  id: propId,
  title: propTitle,
  description: propDescription,
  contactInfo: propContactInfo,
  socialLinks: propSocialLinks,
  onSubmit,
}) => {
  const { data: contactData } = usePublicLanding({
    select: (res) => res.data?.contact_section,
  });

  const id = propId ?? contactData?.id ?? "contact_section";
  const title = propTitle ?? contactData?.title ?? defaultContactData.title;
  const description = propDescription ?? contactData?.subtitle ?? defaultContactData.description;

  const contactInfo =
    propContactInfo ??
    (contactData?.contact_info
      ? {
          email: contactData.contact_info.email ?? defaultContactData.contactInfo.email,
          phone: contactData.contact_info.phone ?? defaultContactData.contactInfo.phone,
          address: contactData.contact_info.address ?? defaultContactData.contactInfo.address,
        }
      : defaultContactData.contactInfo);

  const socialLinks =
    propSocialLinks ??
    (contactData?.social_media
      ? {
          instagram: contactData.social_media.instagram ?? defaultContactData.socialLinks.instagram,
          twitter: contactData.social_media.twitter ?? defaultContactData.socialLinks.twitter,
          facebook: contactData.social_media.facebook ?? defaultContactData.socialLinks.facebook,
        }
      : defaultContactData.socialLinks);

  return (
    <section
      dir="rtl"
      id={id}
      className="relative w-full overflow-hidden bg-mad-white-50 section-spacing px-4 md:px-8"
    >
      {/* Anchor targets for #contact and #contact-us */}
      <span id="contact" className="sr-only absolute -top-24 pointer-events-none" />
      <span id="contact-us" className="sr-only absolute -top-24 pointer-events-none" />

      <div className="container relative mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ==================== FORM CARD COLUMN ==================== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-6 order-2 lg:order-1 relative"
          >
            <ContactFormCard
              onSubmit={onSubmit}
              buttonText={contactData?.button_text}
              formFields={contactData?.form_fields}
            />
          </motion.div>

          {/* ==================== INFO & BRANDING COLUMN ==================== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 xl:col-span-6 order-1 lg:order-2 flex flex-col items-start text-right relative z-10"
          >
            {/* Main Heading */}
            <h2 className="mad-h3 font-extrabold text-mad-text-primary tracking-tight">
              {title}
            </h2>

            {/* Description Subtitle */}
            <p className="my-4 mad-body-2 text-mad-text-secondary max-w-xl">
              {description}
            </p>

            {/* Contact Info Items List */}
            <div className="space-y-3 w-full">
              {/* Email */}
              {contactInfo?.email && (
                <motion.div
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-mad-purple-100 text-mad-purple-600 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <Mail className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="mad-body-2 font-medium text-mad-text-secondary hover:text-mad-purple-600 transition-colors dir-ltr text-right"
                  >
                    {contactInfo.email}
                  </a>
                </motion.div>
              )}

              {/* Phone */}
              {contactInfo?.phone && (
                <motion.div
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-mad-purple-100 text-mad-purple-600 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <Phone className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="mad-body-2 font-medium text-mad-text-secondary hover:text-mad-purple-600 transition-colors dir-ltr text-right"
                  >
                    {contactInfo.phone}
                  </a>
                </motion.div>
              )}

              {/* Address */}
              {contactInfo?.address && (
                <motion.div
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-mad-purple-100 text-mad-purple-600 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <MapPin className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="mad-body-2 font-medium text-mad-text-secondary">
                    {contactInfo.address}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Social Networks Section */}
            <div className="mt-4 pt-2 w-full">
              <h3 className="mad-h6 font-bold text-mad-text-primary mb-4">
                تابعونا على شبكات التواصل
              </h3>

              <div className="flex items-center gap-3">
                {/* Instagram */}
                <motion.a
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href={socialLinks?.instagram || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-mad-purple-600 hover:bg-mad-purple-700 text-mad-white-50 flex items-center justify-center transition-colors shadow-md"
                >
                  <InstagramIcon />
                </motion.a>

                {/* Twitter / X */}
                <motion.a
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href={socialLinks?.twitter || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-10 h-10 rounded-full bg-mad-purple-600 hover:bg-mad-purple-700 text-mad-white-50 flex items-center justify-center transition-colors shadow-md"
                >
                  <TwitterIcon />
                </motion.a>

                {/* Facebook */}
                <motion.a
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href={socialLinks?.facebook || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-mad-purple-600 hover:bg-mad-purple-700 text-mad-white-50 flex items-center justify-center transition-colors shadow-md"
                >
                  <FacebookIcon />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;