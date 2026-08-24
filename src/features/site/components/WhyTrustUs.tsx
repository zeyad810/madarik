"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { usePublicLanding } from "../hooks/usePublicLanding";
import type { WhyTrustUsProps, WhyTrustUsFeature } from "../types";

const TRUST_ICONS = [
  <GraduationCap key="grad" className="size-5" strokeWidth={2} />,
  <Image
    key="glass"
    width={20}
    height={20}
    src="/iamges/whytrustGlassIcon.svg"
    alt="icon"
    className="w-auto h-auto"
  />,
  <Image
    key="brain"
    width={20}
    height={20}
    src="/iamges/whytrustBrainIcon.svg"
    alt="icon"
    className="w-auto h-auto"
  />,
];

const renderTitle = (title: string) => {
  if (!title) return null;

  const words = title.trim().split(/\s+/);
  if (words.length > 3) {
    const firstPart = words.slice(0, 3).join(" ");
    const coloredPart = words.slice(3).join(" ");
    return (
      <>
        {firstPart}{" "}
        <span className="text-mad-main">{coloredPart}</span>
      </>
    );
  }

  return title;
};

const WhyTrustUs: React.FC<WhyTrustUsProps> = ({
  title: propTitle,
  description: propDescription,
  image = "/iamges/whyTrustUs.svg",
  imageAlt = "معلم يستخدم جهازًا لوحيًا",
  features: propFeatures,
}) => {
  const { data: trustData } = usePublicLanding({
    select: (res) => res.data?.trust_section,
  });

  const title = propTitle ?? trustData?.title ?? "";
  const description = propDescription ?? trustData?.description ?? "";
  const id = trustData?.id ?? "";

  const features: WhyTrustUsFeature[] =
    propFeatures ??
    (trustData?.items?.map((item, idx) => ({
      id: `trust-${idx}`,
      title: item.title,
      description: item.description,
      icon: TRUST_ICONS[idx % TRUST_ICONS.length],
    })) ?? []);

  return (
    <section
      dir="rtl"
      id={id}
      className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24   "
    >
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ==================== Content (right side in RTL) ==================== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 flex w-full flex-col items-start text-right lg:order-1"
          >
            {/* Title block */}
            <div className="relative flex w-[80%] md:w-full mx-auto flex-col items-start">
              {/* Decorative splash — absolute, above the first letter on the right */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -top-7 -right-9 select-none"
              >
                <Image
                  src="/iamges/trustUs1svg.svg"
                  alt=""
                  aria-hidden="true"
                  width={47}
                  height={51}
                />
              </motion.div>
              <h2 className="mad-title-2 max-w-2xl font-bold text-gray-800">
                {renderTitle(title)}
              </h2>
              {/* Wavy underline — aligned to the right start */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-2 select-none self-start origin-right"
              >
                <Image
                  src="/iamges/trustUs2svg.svg"
                  alt=""
                  aria-hidden="true"
                  width={126}
                  height={15}
                />
              </motion.div>
            </div>

            {/* Description */}
            <p className="mad-h6 mt-6 max-w-2xl leading-7 text-mad-main/70">
              {description}
            </p>

            {/* Features */}
            <div className="mt-8 w-full max-w-2xl">
              <div className="relative pr-10 sm:pr-12">
                {/* Timeline vertical line */}
                <div
                  aria-hidden="true"
                  className="absolute right-3.5 top-11.25 bottom-11.25 w-px bg-mad-main/20"
                />

                <div className="flex flex-col gap-4">
                  {features.map((feature, idx) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                      whileHover={{ x: -4, transition: { duration: 0.2 } }}
                      className="relative flex items-stretch"
                    >
                      {/* Timeline Dot */}
                      <span
                        aria-hidden="true"
                        className="absolute -right-8 sm:-right-9.75 top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-mad-main ring-4 ring-mad-main/20"
                      />

                      {/* Feature Card */}
                      <div className="flex w-full items-center rounded-2xl bg-[#F8F7FD] px-4 py-4 sm:px-5 transition-shadow duration-300 hover:shadow-md">
                        {/* Icon */}
                        <div className="shrink-0 flex size-10 items-center justify-center rounded-full bg-mad-main text-white shadow-sm">
                          {feature.icon ?? (
                            <span className="text-sm font-bold">●</span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="mr-4 min-w-0 flex-1 text-right">
                          <h3 className="mad-h6 font-bold text-mad-main">
                            {feature.title}
                          </h3>
                          <p className="mt-1 text-xs leading-5 text-mad-main/50 sm:text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ==================== Image (left side in RTL) ==================== */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 flex w-full items-center justify-center lg:order-2"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-758/907 w-full max-w-md lg:max-w-lg"
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyTrustUs;
