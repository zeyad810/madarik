"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useActiveAccount } from "@/hooks/useActiveAccount";

interface LogoProps {
  className?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  src = "/logo.png",
  alt = "شعار منصة مدارك القراءة",
  width = 71,
  height = 83,
  loading = "lazy",
}) => {
  const { isStudent } = useActiveAccount();

  return (
    <Link
      href={isStudent ? "/stories" : "/"}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 599px) 50px, (max-width: 1023px) 64px, 75px"
        className="h-auto w-12.5 object-contain sm:w-16 lg:w-18"
        loading={loading}
      />
    </Link>
  );
};

export default Logo;
