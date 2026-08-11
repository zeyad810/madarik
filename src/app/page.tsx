import Header from "@/components/layout/header/Header";
import Hero from "@/features/site/components/Hero";
import CustomerReviews from "@/features/site/components/CustomerReviews";
import Features from "@/features/site/components/Features";
import HowItWorks from "@/features/site/components/HowItWorks";
import ChildWin from "@/features/site/components/ChildWin";
import Skills from "@/features/site/components/Skills";
import Fqa from "@/features/site/components/Fqa";
import sectionHeading from "../../public/iamges/sectionHeading.png";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <ChildWin />
      <Skills />
      <CustomerReviews imageSrc={sectionHeading.src} />
      <Fqa />
    </main>
  );
}
