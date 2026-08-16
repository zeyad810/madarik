import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import Hero from "@/features/site/components/Hero";
import GlobalLandingLoader from "@/features/site/components/GlobalLandingLoader";
import CustomerReviews from "@/features/site/components/CustomerReviews";
import Features from "@/features/site/components/Features";
import HowItWorks from "@/features/site/components/HowItWorks";
import ChildWin from "@/features/site/components/ChildWin";
import Skills from "@/features/site/components/Skills";
import Fqa from "@/features/site/components/Fqa";
import sectionHeading from "../../public/iamges/sectionHeading.png";
import WhyTrustUs from "@/features/site/components/WhyTrustUs";
import OurJourney from "@/features/site/components/OurJourney";
import Pricing from "@/features/site/components/Pricing";
import InstantReport from "@/features/site/components/InstantReport";
import ProductSection from "@/features/site/components/ProductSection";
import ContactUs from "@/features/site/components/ContactUs";
import MadVideo from "@/features/site/components/MadVideo";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <GlobalLandingLoader />
      <Header />
      <Hero />
      <MadVideo />
      <OurJourney />
      <Features />
      <HowItWorks />
      <ChildWin />
      <Skills />
      <CustomerReviews imageSrc={sectionHeading.src} />
      <Fqa />
      <WhyTrustUs />
      <InstantReport />
      <Pricing />
      <ProductSection />
      <ContactUs />
      <Footer />
    </main>
  );
}


