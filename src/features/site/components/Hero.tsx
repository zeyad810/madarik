import Image from "next/image";
import background from "../../../../public/iamges/header_background.png";
import side from "../../../../public/iamges/side_image.png";
import Button from "@/components/ui/Button";

const Hero = () => {
  return (
    <section
      className="w-full min-h-screen py-16 md:py-0 bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${background.src})`,
      }}
    >
      <div className="container flex flex-col md:flex-row items-center gap-8 md:gap-0 px-4 sm:px-6 md:px-8">
        <div className="w-full md:w-2/3 flex items-start justify-start flex-col gap-5">
          <h1 className="mad-title-1 font-bold text-white">
            نصنع شغف القراءة ونبني عقول المستقبل بلغة الضاد
          </h1>

          <p className="mad-h5 font-normal text-white">
            منصة"مدارك القراءة" التعليمية تقدم لأطفالكم مكتبة رقمية متكاملة تضم
            مئات القصص التفاعلية المصممة بإشراف خبراء لغويين لتطوير مهارات
            القراءة والكتابة بمتعة وأمان.
          </p>

          <div className="flex flex-wrap items-start justify-start gap-6 sm:gap-10 md:gap-18">
            <div className="flex items-start justify-start flex-col gap-1">
              <p className="mad-h3 font-bold text-mad-third">5 - 15 سنة</p>

              <p className="mad-h6 font-medium text-white">الفئة العمرية</p>
            </div>

            <div className="flex items-start justify-start flex-col gap-1">
              <p className="mad-h3 font-bold text-mad-third">5 - 15 سنة</p>

              <p className="mad-h6 font-medium text-white">الفئة العمرية</p>
            </div>

            <div className="flex items-start justify-start flex-col gap-1">
              <p className="mad-h3 font-bold text-mad-third">5 - 15 سنة</p>

              <p className="mad-h6 font-medium text-white">الفئة العمرية</p>
            </div>

            <div className="flex items-start justify-start flex-col gap-1">
              <p className="mad-h3 font-bold text-mad-third">5 - 15 سنة</p>

              <p className="mad-h6 font-medium text-white">الفئة العمرية</p>
            </div>
          </div>
          
          <div className="flex items-start justify-start gap-6">
            <Button
              btnLink="/about"
              btnText="إشترك الآن"
              btnType="fit"
              btnBorder=""
              btnBackground="var(--mad-main)"
              btnColor="var(--mad-white-50)"
              icon="have"
              btnShadow="shadow-(--my-inset-shadow)"
            />
            <Button
              btnLink="/about"
              btnText="تعرف علينا"
              btnType="fit"
            />
          </div>
        </div>

        <Image
          src={side}
          alt="صورة مدارك"
          className="w-full md:w-1/2 max-h-87.5 md:max-h-none object-contain"
          priority
        />
      </div>
    </section>
  );
};

export default Hero;
