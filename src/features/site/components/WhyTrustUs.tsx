import type { WhyTrustUsProps } from "../types";
import Image from "next/image";
import { GraduationCap, Eye, SlidersHorizontal } from "lucide-react";

export const whyTrustUsData: WhyTrustUsProps = {
  title: "لماذا يثق بنا آلاف الآباء والمعلمين؟",

  description:
    "نساعد طفلك على تنمية مهارات القراءة والتفكير من خلال تجربة تعليمية آمنة وممتعة، مع متابعة مستمرة لتقدمه ومحتوى مصمم على يد متخصصين.",

  image: "/images/whyTrustUs.png",

  imageAlt: "معلم يستخدم جهازًا لوحيًا",

  features: [
    {
      id: "comprehensive-experience",
      title: "تجربة تعليمية شاملة",
      description:
        "نقدم تجربة تعليمية متكاملة تجمع بين المتعة والتعلم وتناسب احتياجات الطفل.",
      icon: <GraduationCap className="size-5" strokeWidth={2} />,
    },
    {
      id: "clear-monitoring",
      title: "رقابة كاملة وواضحة",
      description:
        "يمكن للأهل متابعة تقدم أبنائهم ومعرفة المهارات التي تحتاج إلى تطوير.",
      icon: <Eye className="size-5" strokeWidth={2} />,
    },
    {
      id: "personalized-learning",
      title: "تخصيص التعلم لكل طفل",
      description: "نقدم محتوى وتجربة تعليمية مناسبة لمستوى واحتياجات كل طفل.",
      icon: <SlidersHorizontal className="size-5" strokeWidth={2} />,
    },
  ],
};

/**
 * Decorative 4-point sparkle/star SVG (matches the reference design).
 * Pass a unique `id` whenever you render more than one on the same page
 * so the gradient defs don't collide.
 */
const SparkleStar = ({ id, className }: { id: string; className?: string }) => (
  <svg viewBox="0 0 51 51" fill="none" aria-hidden="true" className={className}>
    <path
      d="M25.5 0C25.5 0 27 18 33 24C39 30 51 25.5 51 25.5C51 25.5 39 27 33 33C27 39 25.5 51 25.5 51C25.5 51 24 33 18 27C12 21 0 25.5 0 25.5C0 25.5 12 24 18 18C24 12 25.5 0 25.5 0Z"
      fill={`url(#${id})`}
    />
    <defs>
      <linearGradient
        id={id}
        x1="0"
        y1="0"
        x2="51"
        y2="51"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFD84D" />
        <stop offset="1" stopColor="#FF9F1C" />
      </linearGradient>
    </defs>
  </svg>
);

/** Highlights the word "آلاف" inside the title with a gradient color. */
const renderTitle = (title: string) => {
  const highlight = "آلاف";
  if (!title.includes(highlight)) return title;

  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="bg-linear-to-l from-mad-main to-purple-400 bg-clip-text text-transparent">
        {highlight}
      </span>
      {after}
    </>
  );
};

const WhyTrustUs = ({
  title,
  description,
  image,
  imageAlt,
  features,
}: WhyTrustUsProps) => {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative sparkles */}
        <SparkleStar
          id="sparkle-title"
          className="absolute -top-2 right-6 size-7 sm:size-9 lg:right-10"
        />
        <SparkleStar
          id="sparkle-image"
          className="absolute bottom-10 left-4 size-6 sm:size-8 lg:left-10"
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ==================== Content (right side) ==================== */}
          <div className="order-1 flex w-full flex-col items-start text-right lg:order-1">
            {/* Title */}
            <h2 className="mad-title-2 max-w-2xl font-bold text-mad-main">
              {renderTitle(title)}
            </h2>

            {/* Description */}
            <p className="mad-h6 mt-4 max-w-2xl leading-7 text-mad-main/70">
              {description}
            </p>

            {/* Features */}
            <div className="mt-8 w-full max-w-2xl">
              <div className="relative">
                {/* Timeline Line */}
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    right-5
                    top-5
                    bottom-5
                    hidden
                    w-px
                    bg-mad-main/20
                    sm:block
                  "
                />

                <div className="flex flex-col gap-5">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className="relative flex items-center"
                    >
                      {/* Feature Card */}
                      <div
                        className="
                          flex
                          w-full
                          min-w-0
                          items-center
                          justify-between
                          rounded-2xl
                          bg-[#F8F7FD]
                          px-4
                          py-4
                          sm:px-5
                        "
                      >
                        {/* Text */}
                        <div className="min-w-0 text-right">
                          <h3 className="mad-h6 font-bold text-mad-main">
                            {feature.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-mad-main/50 sm:text-sm">
                            {feature.description}
                          </p>
                        </div>

                        {/* Icon */}
                        <div
                          className="
                            mr-4
                            flex
                            size-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-mad-main
                            text-white
                          "
                        >
                          {feature.icon ?? (
                            <span className="text-sm font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Timeline Dot */}
                      <span
                        aria-hidden="true"
                        className="
                          absolute
                          right-4.5
                          hidden
                          size-2.5
                          rounded-full
                          bg-mad-main
                          sm:block
                        "
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ==================== Image (left side) ==================== */}
          <div className="order-2 flex w-full items-center justify-center lg:order-2">
            <div className="relative aspect-831/440 w-full max-w-150">
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTrustUs;
