import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps {
  btnLink: string;
  btnText: string;
  btnType: "full" | "fit" ;
  icon?: "have" | "none";
  btnIcon?: "have" | "none";
  iconElement?: ReactNode;
  btnBorder?: string;
  btnBackground?: string;
  btnColor?: string;
  btnShadow?: string;
  className?: string;
  children?: ReactNode;
}

const Button = ({
  btnLink,
  btnText,
  btnType,
  icon = "none",
  btnIcon,
  iconElement,
  btnBorder,
  btnBackground,
  btnColor,
  btnShadow,
  className,
  children,
}: ButtonProps) => {
  const hasIcon = icon === "have" || btnIcon === "have";
  const shadowClass = btnShadow?.startsWith("shadow-") ? btnShadow : undefined;
  const style: CSSProperties = {
    border: btnBorder,
    backgroundColor: btnBackground,
    color: btnColor,
    boxShadow: shadowClass ? undefined : btnShadow,
  };

  return (
    <Link
      href={btnLink}
      style={style}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
        btnType === "full" ? "w-full" : "w-fit",
        hasIcon && "gap-2",
        shadowClass,
        className,
      )}
    >
      {children ?? btnText}
      {iconElement ?? (hasIcon ? <ArrowLeft aria-hidden="true" size={18} /> : null)}
    </Link>
  );
};

export default Button;
