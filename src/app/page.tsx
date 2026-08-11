import Header from "@/components/layout/header/Header";
import Hero from "@/features/site/components/Hero";
import CustomerReviews from "@/features/site/components/CustomerReviews";
import Features from "@/features/site/components/Features";
import HowItWorks from "@/features/site/components/HowItWorks";
import Skills from "@/features/site/components/Skills";
import WhyTrustUs, { whyTrustUsData } from "@/features/site/components/WhyTrustUs";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Skills />
      <CustomerReviews />
      <WhyTrustUs {...whyTrustUsData} />  
    </main>
  );
}
