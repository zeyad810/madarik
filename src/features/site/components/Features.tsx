import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";

export interface FeatureItem {
  id: string | number;
  title: string;
  description: string;
  accentColor: string;
  bgCircleColor: string;
  icon?: React.ReactNode;
  imageSrc?: string;
}

interface FeaturesProps {
  title?: string;
  description?: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  features?: FeatureItem[];
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: "interactive-stories",
    title: "قصص تفاعلية",
    description:
      "قصص مصممة بأسلوب شيق يساعد الأطفال على تنمية حب القراءة والاستمرار في التعلم.",
    accentColor: "var(--mad-third)",
    bgCircleColor: "var(--mad-orange-light)",
    imageSrc: "/assets/book.svg",
  },
  {
    id: "instant-reports",
    title: "تقارير فورية",
    description:
      "تابع مستوى الطفل وإنجازاته من خلال تقارير واضحة ومحدثة باستمرار.",
    accentColor: "var(--mad-main-light)",
    bgCircleColor: "rgba(139, 92, 246, 0.12)",
    imageSrc: "/assets/report.svg",
  },
  {
    id: "skills-measurement",
    title: "قياس مهارات القراءة",
    description:
      "قيّم مستوى القراءة لدى الطفل وحدد نقاط القوة والجوانب التي تحتاج إلى تطوير.",
    accentColor: "var(--mad-secondary)",
    bgCircleColor: "var(--mad-green-light)",
    imageSrc: "/assets/checkedbook.svg",
  },
  {
    id: "parent-account",
    title: "حساب ولي الأمر",
    description:
      "إدارة جميع حسابات الأطفال من مكان واحد مع متابعة تقدم كل طفل بشكل مستقل.",
    accentColor: "var(--mad-orange)",
    bgCircleColor: "rgba(234, 88, 12, 0.12)",
    imageSrc: "/assets/parent.svg",
  },
  {
    id: "suitable-for-schools",
    title: "مناسب للمدارس",
    description: "إدارة المدارس لمتابعة الطلاب وإدارة الفصول الدراسية بسهولة.",
    accentColor: "var(--mad-third)",
    bgCircleColor: "var(--mad-orange-light)",
    imageSrc: "/assets/school.svg",
  },
];

const Features: React.FC<FeaturesProps> = ({
  title = "لماذا مدارك القراءة؟",
  description = "صممت منصة مدارك القراءة لتمنح الأطفال تجربة تعليمية ممتعة، وتوفر لأولياء الأمور والمعلمين الأدوات اللازمة لمتابعة تطور مهارات القراءة بثقة وسهولة.",
  subtitle,
  imageSrc,
  imageAlt,
  features = DEFAULT_FEATURES,
}) => {
  return (
    <section dir="rtl" className="w-full section-spacing px-4 md:px-8 bg-white">
      <div className="container mx-auto flex flex-col items-center">
        {/* Section Header */}
        <SectionHeader
          title={title}
          description={description}
          subtitle={subtitle}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          align="center"
          className="mb-12 md:mb-16 max-w-3xl"
        />

        {/* Features Cards Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              accentColor={feature.accentColor}
              bgCircleColor={feature.bgCircleColor}
              icon={feature.icon}
              imageSrc={feature.imageSrc}
              className="last:col-span-2 last:justify-self-center last:w-[calc(50%-10px)] md:last:col-span-1 md:last:w-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;


