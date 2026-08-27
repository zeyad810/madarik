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
  priority?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  src = "/logo.png",
  alt = "شعار منصة مدارك القراءة",
  width = 100,
  height = 100,
  priority = false,
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
        className="w-auto h-auto object-contain"
        priority={priority}
      />
    </Link>
  );
};

export default Logo;