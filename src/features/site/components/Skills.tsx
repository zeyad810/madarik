import React from "react";
import Button from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";

import { SkillCardItem } from "../types";


const RIGHT_CARDS: SkillCardItem[] = [
  {
    id: "reading-results",
    title: "تحويل نتائج القراءة إلى بيانات واضحة",
    description:
      "نحول أداء الطفل إلى مؤشرات سهلة الفهم تساعد في قياس مستوى التقدم واتخاذ قرارات تعليمية أفضل",
    accentColor: "#14b8a6",
    imageSrc: "/assets/pie-chart.svg",
  },
  {
    id: "progress-tracking",
    title: "متابعة التقدم عبر الزمن",
    description:
      "راقب تطور مهارات القراءة بمرور الوقت، واكتشف الإنجازات والتحسن في كل مرحلة.",
    accentColor: "#fbbf24",
    imageSrc: "/assets/magnifying-glass-icon-search.svg",
  },
];

const LEFT_CARDS: SkillCardItem[] = [
  {
    id: "parent-account",
    title: "متابعة من خلال حساب ولي الأمر",
    description:
      "يستطيع ولي الأمر الاطلاع على تقارير الطفل وإنجازاته ومستوى أداءه في أي وقت ومن أي مكان.",
    accentColor: "#8b5cf6",
    imageSrc: "/assets/user-performance-analytics.svg",
  },
  {
    id: "school-reports",
    title: "تقارير دورية للمدارس",
    description:
      "توفر المنصة تقارير شاملة للمعلمين والإدارة لمتابعة أداء الطلاب، وقياس مستوى الفصول",
    accentColor: "#ec4899",
    imageSrc: "/assets/school 2.svg",
  },
];

const Skills: React.FC = () => {
  return (
    <section dir="rtl" className="w-full bg-[#f8fafc]/50 section-spacing px-4 md:px-8 overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 xl:gap-16">
        
        {/* Text & Action Side (Placed FIRST in DOM so order-1 puts it on the RIGHT in RTL) */}
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-right order-1">
          <h2 className="mad-h2 font-extrabold text-mad-text-primary mb-4 md:mb-6 leading-tight">
            مدارك القراءة... أكثر من مجرد قصص
          </h2>
          <p className="mad-body-1 text-mad-text-secondary font-normal mb-8 leading-relaxed max-w-xl">
            لا تقتصر مدارك القراءة على تقديم قصص تفاعلية، بل تمنح أولياء الأمور والمدارس رؤية واضحة لتطور مهارات القراءة، من خلال تقارير ذكية وبيانات تساعد على دعم رحلة الطفل التعليمية
          </p>
          <Button
            btnLink="#"
            btnText="ابدأ تجربتك المجانية الآن"
            btnType="fit"
            icon="have"
            btnBackground="var(--mad-main)"
            btnColor="#ffffff"
            className="px-7 py-3.5 mad-body-2 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-full"
          />
        </div>

        {/* Cards Side (Placed SECOND in DOM so order-2 puts it on the LEFT in RTL) */}
        <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-8 order-2">
          {/* Right Column of Cards (inner column, next to text) */}
          <div className="flex flex-col gap-5 lg:gap-8">
            {RIGHT_CARDS.map((card) => (
              <FeatureCard
                key={card.id}
                title={card.title}
                description={card.description}
                accentColor={card.accentColor}
                imageSrc={card.imageSrc}
                className="items-start text-start shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
              />
            ))}
          </div>

          {/* Left Column of Cards (outer left column, shifted down on desktop) */}
          <div className="flex flex-col gap-5 lg:gap-8 lg:translate-y-8">
            {LEFT_CARDS.map((card) => (
              <FeatureCard
                key={card.id}
                title={card.title}
                description={card.description}
                accentColor={card.accentColor}
                imageSrc={card.imageSrc}
                className="items-start text-start shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;
