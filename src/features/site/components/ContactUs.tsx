"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactFormCard } from "./ContactFormCard";
import { InstagramIcon, TwitterIcon, FacebookIcon } from "./ContactIcons";
import { defaultContactData } from "./contactData";
import type { ContactUsProps } from "../types";

const ContactUs: React.FC<ContactUsProps> = ({
  title = defaultContactData.title,
  description = defaultContactData.description,
  contactInfo = defaultContactData.contactInfo,
  socialLinks = defaultContactData.socialLinks,
  onSubmit,
}) => {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden bg-mad-white-50 section-spacing px-4 md:px-8"
    >
      <div className="container relative mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ==================== FORM CARD COLUMN (Reversed order on mobile: order-2, desktop: lg:order-1) ==================== */}
          <div className="lg:col-span-6 xl:col-span-6 order-2 lg:order-1 relative">
            <ContactFormCard onSubmit={onSubmit} />
          </div>

          {/* ==================== INFO & BRANDING COLUMN (Reversed order on mobile: order-1, desktop: lg:order-2) ==================== */}
          <div className="lg:col-span-6 xl:col-span-6 order-1 lg:order-2 flex flex-col items-start text-right relative z-10">
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
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-mad-purple-100 text-mad-purple-600 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <Mail className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="mad-body-2 font-medium text-mad-text-secondary hover:text-mad-purple-600 transition-colors dir-ltr text-right"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}

              {/* Phone */}
              {contactInfo?.phone && (
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-mad-purple-100 text-mad-purple-600 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <Phone className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="mad-body-2 font-medium text-mad-text-secondary hover:text-mad-purple-600 transition-colors dir-ltr text-right"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              )}

              {/* Address */}
              {contactInfo?.address && (
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-mad-purple-100 text-mad-purple-600 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs">
                    <MapPin className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="mad-body-2 font-medium text-mad-text-secondary">
                    {contactInfo.address}
                  </span>
                </div>
              )}
            </div>

            {/* Social Networks Section */}
            <div className="mt-4 pt-2 w-full">
              <h3 className="mad-h6 font-bold text-mad-text-primary mb-4">
                تابعونا على شبكات التواصل
              </h3>

              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href={socialLinks?.instagram || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-mad-purple-600 hover:bg-mad-purple-700 text-mad-white-50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md active:scale-95"
                >
                  <InstagramIcon />
                </a>

                {/* Twitter / X */}
                <a
                  href={socialLinks?.twitter || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-10 h-10 rounded-full bg-mad-purple-600 hover:bg-mad-purple-700 text-mad-white-50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md active:scale-95"
                >
                  <TwitterIcon />
                </a>

                {/* Facebook */}
                <a
                  href={socialLinks?.facebook || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-mad-purple-600 hover:bg-mad-purple-700 text-mad-white-50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md active:scale-95"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;