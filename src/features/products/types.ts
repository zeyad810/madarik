export interface Product {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  ageRange?: string;
  isFree?: boolean;
  levelTag?: string;
  storyCodeTag?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ProductCardProps {
  product?: Product;
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  ageRange?: string;
  isFree?: boolean;
  levelTag?: string;
  storyCodeTag?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  className?: string;
}
