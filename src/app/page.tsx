import Header from "@/components/layout/header/Header";
import { SectionHeader } from "@/components/ui/SectionHeader";
import CustomerReviews from "@/features/site/components/CustomerReviews";
import Features from "@/features/site/components/Features";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <Header />
      <Features />
      <div className="flex w-full flex-col gap-16 px-4 py-12 md:px-8 container mx-auto">
        <CustomerReviews />
      </div>
      <div className="flex flex-col gap-16 py-12 px-4 md:px-8 container mx-auto">
        <SectionHeader
          align="center"
          subtitle="آراء العملاء"
          imageSrc="/iamges/Header/header_background.png"
          imageAlt="أيقونة كتاب ونجمة"
          imageWidth={100}
          imageHeight={100}
          title=" رحلتنا نحو صناعة جيل قارئ"
          description="نؤمن بأن بناء شخصية الطفل يبدأ من ترسيخ القيم وتنمية الفضول وتحويل المهارات إلى أدوات يعيشها بحب وسعادة ومعنى."
        />
      </div>
    </main>
  );
}
