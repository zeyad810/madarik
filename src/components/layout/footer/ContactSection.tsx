import React from "react";
import { ContactInfo } from "./types";
import { DEFAULT_CONTACT_INFO } from "./constants";

interface ContactSectionProps {
  contactInfo?: ContactInfo;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  contactInfo = DEFAULT_CONTACT_INFO,
}) => {
  return (
    <div className="flex flex-col items-start text-right">
      <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
        تواصل معنا
      </h3>

      <div className="flex flex-col gap-3 text-xs sm:text-sm text-white/90 font-normal">
        {/* Email */}
        <a
          href={`mailto:${contactInfo.email}`}
          className="hover:text-white transition-colors dir-ltr text-right"
        >
          {contactInfo.email}
        </a>

        {/* Phone */}
        <a
          href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
          className="hover:text-white transition-colors dir-ltr text-right"
        >
          {contactInfo.phone}
        </a>

        {/* Location */}
        <p className="leading-relaxed text-right">{contactInfo.location}</p>
      </div>
    </div>
  );
};

export default ContactSection;
