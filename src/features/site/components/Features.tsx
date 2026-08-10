import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export interface FeatureItem {
  id: string | number;
  title: string;
  description: string;
  accentColor: string;
  bgCircleColor: string;
  icon: React.ReactNode;
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
    accentColor: "var(--color-third)",
    bgCircleColor: "var(--color-light-orange)",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 8.5C6 7.11929 7.11929 6 8.5 6H15V24H8.5C7.11929 24 6 22.8807 6 21.5V8.5Z"
          fill="var(--color-third)"
          fillOpacity="0.3"
          stroke="var(--color-third)"
          strokeWidth="1.5"
        />
        <path
          d="M26 8.5C26 7.11929 24.8807 6 23.5 6H17V24H23.5C24.8807 24 26 22.8807 26 21.5V8.5Z"
          fill="var(--color-third)"
          fillOpacity="0.5"
          stroke="var(--color-third)"
          strokeWidth="1.5"
        />
        <path
          d="M16 5V25"
          stroke="var(--color-third)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Sparkles */}
        <path
          d="M16 2.5L16.8 4L18.3 4.8L16.8 5.6L16 7.1L15.2 5.6L13.7 4.8L15.2 4L16 2.5Z"
          fill="var(--color-third)"
        />
        <path
          d="M8.5 11H13M8.5 15H13M19 11H23.5M19 15H23.5"
          stroke="var(--color-third)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "instant-reports",
    title: "تقارير فورية",
    description:
      "تابع مستوى الطفل وإنجازاته من خلال تقارير واضحة ومحدثة باستمرار.",
    accentColor: "var(--color-lightmain)",
    bgCircleColor: "rgba(139, 92, 246, 0.12)",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="8"
          y="5"
          width="16"
          height="22"
          rx="3"
          fill="var(--color-lightmain)"
          fillOpacity="0.2"
          stroke="var(--color-lightmain)"
          strokeWidth="1.5"
        />
        <rect x="12" y="10" width="8" height="2" rx="1" fill="var(--color-primary)" />
        <rect x="12" y="14" width="8" height="2" rx="1" fill="var(--color-lightmain)" />
        <rect x="12" y="18" width="5" height="2" rx="1" fill="var(--color-lightmain)" />
        {/* Ribbon Badge */}
        <circle
          cx="20"
          cy="21"
          r="4.5"
          fill="var(--color-third)"
          stroke="var(--color-white)"
          strokeWidth="1.5"
        />
        <path
          d="M18.5 25L17.5 28.5L20 27L22.5 28.5L21.5 25"
          fill="var(--color-third)"
        />
      </svg>
    ),
  },
  {
    id: "skills-measurement",
    title: "قياس مهارات القراءة",
    description:
      "قيّم مستوى القراءة لدى الطفل وحدد نقاط القوة والجوانب التي تحتاج إلى تطوير.",
    accentColor: "var(--color-secondary)",
    bgCircleColor: "var(--color-green-light)",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 10C7 8.34315 8.34315 7 10 7H15V23H10C8.34315 23 7 21.6569 7 20V10Z"
          fill="var(--color-secondary)"
          fillOpacity="0.2"
          stroke="var(--color-secondary)"
          strokeWidth="1.5"
        />
        <path
          d="M25 10C25 8.34315 23.6569 7 22 7H17V23H22C23.6569 23 25 21.6569 25 20V10Z"
          fill="var(--color-secondary)"
          fillOpacity="0.3"
          stroke="var(--color-secondary)"
          strokeWidth="1.5"
        />
        {/* Target/Badge */}
        <circle
          cx="16"
          cy="12"
          r="4.5"
          fill="var(--color-green)"
          stroke="var(--color-white)"
          strokeWidth="1"
        />
        <circle cx="16" cy="12" r="2" fill="var(--color-third)" />
        <path
          d="M13.5 19.5L16 17.5L18.5 19.5V25.5L16 24L13.5 25.5V19.5Z"
          fill="var(--color-green)"
        />
      </svg>
    ),
  },
  {
    id: "parent-account",
    title: "حساب ولي الأمر",
    description:
      "إدارة جميع حسابات الأطفال من مكان واحد مع متابعة تقدم كل طفل بشكل مستقل.",
    accentColor: "var(--color-orange)",
    bgCircleColor: "rgba(234, 88, 12, 0.12)",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Parent avatar */}
        <circle cx="13" cy="11" r="3.5" fill="var(--color-orange)" fillOpacity="0.7" />
        <path
          d="M7 23C7 19.6863 9.68629 17 13 17C16.3137 17 19 19.6863 19 23V24H7V23Z"
          fill="var(--color-orange)"
        />
        {/* Child avatar */}
        <circle cx="21" cy="14" r="2.5" fill="var(--color-third)" />
        <path
          d="M17.5 24C17.5 21.5147 19.5147 19.5 22 19.5C24.4853 19.5 26.5 21.5147 26.5 24V24.5H17.5V24Z"
          fill="var(--color-third)"
        />
      </svg>
    ),
  },
  {
    id: "suitable-for-schools",
    title: "مناسب للمدارس",
    description: "إدارة المدارس لمتابعة الطلاب وإدارة الفصول الدراسية بسهولة.",
    accentColor: "var(--color-third)",
    bgCircleColor: "var(--color-light-orange)",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* School Roof */}
        <path d="M16 5L6 11H26L16 5Z" fill="var(--color-third)" />
        {/* Flag */}
        <path
          d="M16 2V5M16 2H19.5L18 3.5L19.5 5H16"
          stroke="var(--color-orange)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Building Base */}
        <rect
          x="8"
          y="11"
          width="16"
          height="14"
          rx="1"
          fill="var(--color-third)"
          fillOpacity="0.3"
          stroke="var(--color-third)"
          strokeWidth="1.5"
        />
        {/* Pillars / Door */}
        <rect x="14" y="18" width="4" height="7" rx="2" fill="var(--color-orange)" />
        <rect x="10" y="14" width="3" height="3" rx="0.5" fill="var(--color-third)" />
        <rect x="19" y="14" width="3" height="3" rx="0.5" fill="var(--color-third)" />
      </svg>
    ),
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
    <section dir="rtl" className="w-full py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
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
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-white rounded-3xl p-6 flex flex-col items-center text-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
            >
              {/* Colored Top Accent Bar */}
              <div
                className="absolute top-0 inset-x-6 h-[4px] rounded-b-full opacity-90 transition-all duration-300 group-hover:h-[5px]"
                style={{
                  backgroundColor: feature.accentColor,
                  boxShadow: `0 2px 8px ${feature.accentColor}`,
                }}
              />

              {/* Icon Container */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: feature.bgCircleColor }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-text-primary mb-3 tracking-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-xs md:text-sm leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

