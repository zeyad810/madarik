import React from "react";
import { redirect } from "next/navigation";
import Hero from "@/features/site/components/Hero";
import CustomerReviews from "@/features/site/components/CustomerReviews";
import Features from "@/features/site/components/Features";
import HowItWorks from "@/features/site/components/HowItWorks";
import ChildWin from "@/features/site/components/ChildWin";
import Skills from "@/features/site/components/Skills";
import Fqa from "@/features/site/components/Fqa";
import sectionHeading from "../../../public/iamges/sectionHeading.png";
import WhyTrustUs from "@/features/site/components/WhyTrustUs";
import OurJourney from "@/features/site/components/OurJourney";
import Pricing from "@/features/site/components/Pricing";
import InstantReport from "@/features/site/components/InstantReport";
import ProductSection from "@/features/site/components/ProductSection";
import ContactUs from "@/features/site/components/ContactUs";
import MadVideo from "@/features/site/components/MadVideo";
import { Bannerslider, HashScroller } from "@/features/site";

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams ? await searchParams : {};
  const hasPaymentParams = Boolean(
    query.payment_id ||
    query.paymentId ||
    query.payment_link_id ||
    query.streampay_id ||
    query.invoice_id ||
    (query.id && query.status)
  );

  if (hasPaymentParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    }
    redirect(`/payment/callback?${params.toString()}`);
  }
  return (
    <div className="w-full flex flex-col">
      <HashScroller />
      <Hero />
      <Features />
      <HowItWorks />
      <MadVideo />
      <InstantReport />
      <Skills />
      <ChildWin />
      <ProductSection />
      <Bannerslider />
      <WhyTrustUs />
      <OurJourney />
      <Pricing />
      <CustomerReviews imageSrc={sectionHeading.src} />
      <Fqa />
      <ContactUs />
    </div>
  );
}
