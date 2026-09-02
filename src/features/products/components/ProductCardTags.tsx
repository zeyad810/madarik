import React from "react";

interface ProductCardTagsProps {
  storyCodeTag?: string;
  levelTag?: string;
  outcome?: string;
  pagesCount?: number;
}

export const ProductCardTags: React.FC<ProductCardTagsProps> = ({
  storyCodeTag,
  levelTag,
  outcome,
}) => {
  if (!storyCodeTag && !levelTag && !outcome) return null;

  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex items-center justify-between gap-2 flex-row-reverse">
        {/* Story Code Tag (Left in RTL) */}
        {storyCodeTag && (
          <span className="bg-[#EBF7F5] text-[#0D9488] text-xs font-semibold px-3 py-1 rounded-full select-none">
            {storyCodeTag}
          </span>
        )}

        {/* Level Tag (Right in RTL) */}
        {levelTag && (
          <span className="bg-[#FAF6EA] text-[#854D0E] text-xs font-bold px-3.5 py-1 rounded-full select-none">
            {levelTag}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCardTags;
