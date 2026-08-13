import React from "react";
import Image from "next/image";

interface AuthHeaderProps {
  logoAlt: string;
  heading: string;
  typographyHeading?: string;
  colorsHeading?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  logoAlt,
  heading,
  typographyHeading = "text-2xl sm:text-3xl font-bold",
  colorsHeading = "text-[#101828]",
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
      <h1 className={`${typographyHeading} ${colorsHeading} mb-8 text-center tracking-tight`}>
        {heading}
      </h1>
    </>
  );
};

export default AuthHeader;
