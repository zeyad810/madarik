export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface SectionHeaderProps {
  title?: string;
  description?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  align?: "center" | "start" | "end";
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}