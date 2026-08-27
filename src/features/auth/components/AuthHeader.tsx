import React from "react";
import Image from "next/image";

interface AuthHeaderProps {
  logoAlt: string;
  heading: string;
  description?: string;
  typographyHeading?: string;
  colorsHeading?: string;
  typographyDescription?: string;
  colorsDescription?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  logoAlt,
  heading,
  description,
  typographyHeading = "text-2xl sm:text-3xl font-bold",
  colorsHeading = "text-[#101828]",
  typographyDescription = "text-sm",
  colorsDescription = "text-[#667085]",
}) => {
  return (
    <>
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/logo- 1.png"
          alt={logoAlt}
          width={140}
          height={140}
          className="w-auto h-28 object-contain"
          priority
        />
      </div>

      {/* Heading */}
      <h1 className={`${typographyHeading} ${colorsHeading} ${description ? "mb-2" : "mb-8"} text-center tracking-tight`}>
        {heading}
      </h1>

      {/* Optional Subtitle / Description */}
      {description && (
        <p className={`${typographyDescription} ${colorsDescription} mb-8 text-center max-w-sm`}>
          {description}
        </p>
      )}
    </>
  );
};

export default AuthHeader;

