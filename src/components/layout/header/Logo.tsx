import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  src = "/logo.png",
  alt = "شعار منصة مدارك القراءة"
}) => {
  return (
    <Link
      href="/"
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        className="w-auto h-auto object-contain"
        priority
      />
    </Link>
  );
};

export default Logo;