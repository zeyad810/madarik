import Header from "@/components/layout/header/Header";
import { SectionHeader } from "@/components/ui/SectionHeader";
import CustomerReviews from "@/features/site/components/CustomerReviews";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <Header />
      <h1 className="text-4xl font-bold">Welcome to Madarik</h1>
      <p className="mt-4 text-zinc-500">
        Modular Next.js Application Architecture
      </p>
      <div className="flex w-full flex-col gap-16 px-4 py-12 md:px-8 mx-auto">
        <CustomerReviews />
      </div>
      <div className="flex flex-col gap-16 py-12 px-4 md:px-8 max-w-6xl mx-auto">
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
