import React from "react";

interface ProductCardTagsProps {
  storyCodeTag?: string;
  levelTag?: string;
}

export const ProductCardTags: React.FC<ProductCardTagsProps> = ({
  storyCodeTag,
  levelTag,
}) => {
  if (!storyCodeTag && !levelTag) return null;

  return (
    <div className="flex items-center justify-between gap-2 mb-4 flex-row-reverse">
      {/* Story Code Tag (Left in RTL) */}
      {storyCodeTag && (
        <span className="bg-[#EBF7F5] text-[#0D9488] text-xs font-semibold px-3.5 py-1.5 rounded-full select-none">
          {storyCodeTag}
        </span>
      )}

      {/* Level Tag (Right in RTL) */}
      {levelTag && (
        <span className="bg-[#FAF6EA] text-[#854D0E] text-xs font-bold px-4 py-1.5 rounded-full select-none">
          {levelTag}
        </span>
      )}
    </div>
  );
};

export default ProductCardTags;
