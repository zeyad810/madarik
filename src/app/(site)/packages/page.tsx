import React from "react";
import { Metadata } from "next";
import { PackagesSelectionView } from "@/features/packages";

export const metadata: Metadata = {
  title: "اختيار الباقة | مدارك القراءة",
  description:
    "باقات مرنة تناسب جميع المراحل العمرية، تمنح طفلك تجربة قراءة تفاعلية ممتعة وآمنة.",
};

export default function PackagesSelectionPage() {
  return <PackagesSelectionView />;
}
