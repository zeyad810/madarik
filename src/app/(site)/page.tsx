import React from "react";
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
import { StudentRedirect } from "@/components/guards";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      <StudentRedirect />
      <HashScroller />
      <Hero />
      <Features />
      <HowItWorks />
      <MadVideo />
      <InstantReport />
      <Skills />
      <ChildWin />
      <ProductSection />
      <WhyTrustUs />
      <OurJourney />
      <Pricing />
      <CustomerReviews imageSrc={sectionHeading.src} />
      <Fqa />
      <ContactUs />
      <Bannerslider />
    </div>
  );
}
