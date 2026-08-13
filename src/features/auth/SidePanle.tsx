import Image from "next/image";
import { AUTH_TEXTS } from "./constants";

interface SidePanleProps {
  src?: string;
  alt?: string;
  className?: string;
}

const SidePanle = ({
  src = "/assets/auth-panle.png",
  alt = AUTH_TEXTS.sidePanel.alt,
  className = "",
}: SidePanleProps) => {
  return (
    <div
      className={`hidden md:block w-full md:w-1/2 flex-1 max-w-[928px] max-h-[875px] aspect-[928/875] relative overflow-hidden shrink ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={928}
        height={875}
        priority
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default SidePanle;