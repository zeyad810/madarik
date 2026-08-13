import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { Home, ArrowRight, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-mad-white-50 font-sans">
      {/* Site Header */}
      <Header />

      {/* Main 404 Hero Container */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-mad-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-mad-main-light/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Bouncing 404 Image Illustration */}
          <div className="relative w-64 h-52 sm:w-80 sm:h-64 md:w-110 md:h-80 mx-auto select-none animate-bounce duration-1000">
            <Image
              src="/assets/404.png"
              alt="404 - الصفحة غير موجودة"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* Heading */}
          <h1 className="mad-h2 font-extrabold text-mad-text-primary mt-6 sm:mt-8 tracking-tight">
            عذراً، هذه الصفحة غير موجودة!
          </h1>

          {/* Subtitle / Explanation */}
          <p className="mad-body-1 text-mad-text-secondary mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed">
            يبدو أن الرابط الذي حاولت الوصول إليه غير صحيح أو تم نقل الصفحة إلى عنوان آخر. لا تقلق، يمكنك العودة دائماً واستكمال رحلة طفلك التعليمية.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 w-full ">
            {/* Primary Action Button */}
            <Link
              href="/"
              className="bg-linear-to-r from-mad-purple-600 via-mad-purple-700 to-mad-purple-800 hover:from-mad-purple-700 hover:to-mad-purple-900 text-mad-white-50 font-bold mad-label-1 px-8 py-4 rounded-full inline-flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-mad-purple-600/30 hover:shadow-xl hover:shadow-mad-purple-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex-1  w-auto group cursor-pointer"
            >
              <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>العودة إلى الصفحة الرئيسية</span>
              <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            </Link>

            {/* Secondary Action Button */}
            <Link
              href="/#products"
              className="bg-mad-white-50 hover:bg-mad-purple-100/60 text-mad-purple-600 border-2 border-mad-purple-200 hover:border-mad-purple-500 font-bold mad-label-1 px-8 py-4 rounded-full inline-flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex-1 min-w-[190px] group cursor-pointer"
            >
              <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>استكشف المنصة</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
