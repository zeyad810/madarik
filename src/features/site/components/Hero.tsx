import Image from "next/image";
import background from "../../../../public/iamges/Header/header_background.png";
import side from "../../../../public/iamges/Header/side_image.png"
import Button from "@/components/ui/Button";

const Hero = () => {
  return (
    <section
      className=" h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${background.src})`,
      }}
    >
      <div className="container flex items-center">
        <div className="w-2/3 flex items-start justify-start flex-col gap-5">
          <h1 className=" text-white text-7xl font-bold ">
            نصنع شغف القراءة ونبني عقول المستقبل بلغة الضاد
          </h1>

          <p className="text-white font-normal text-2xl">
            منصة "مدارك القراءة" التعليمية تقدم لأطفالكم مكتبة رقمية متكاملة تضم
            مئات القصص التفاعلية المصممة بإشراف خبراء لغويين لتطوير مهارات
            القراءة والكتابة بمتعة وأمان.
          </p>

          <div className="flex items-start justify-start gap-[72px]">
            <div className="flex items-start justify-start flex-col gap-1">
              <p className="text-mad-third font-bold text-3xl">5 - 15 سنة</p>

              <p className="text-white font-medium text-xl">الفئة العمرية</p>
            </div>

            <div className="flex items-start justify-start flex-col gap-1">
              <p className="text-mad-third font-bold text-3xl">5 - 15 سنة</p>

              <p className="text-white font-medium text-xl">الفئة العمرية</p>
            </div>

            <div className="flex items-start justify-start flex-col gap-1">
              <p className="text-mad-third font-bold text-3xl">5 - 15 سنة</p>

              <p className="text-white font-medium text-xl">الفئة العمرية</p>
            </div>

            <div className="flex items-start justify-start flex-col gap-1">
              <p className="text-mad-third font-bold text-3xl">5 - 15 سنة</p>

              <p className="text-white font-medium text-xl">الفئة العمرية</p>
            </div>
          </div>
          
          <div className="">
            <Button
              btnLink="/about"
              btnText="إشترك الآن"
              btnType="fit"
              btnBorder=""
              btnBackground="var(--mad-main)"
              btnColor="var(--mad-white-50)"
              icon="have"
              btnShadow="shadow-(--my-inset-shadow)"
              // btnType=
            />
          </div>
        </div>

        {/* <div className="w-1/3"> */}
        <Image
          src={side}
          alt=""
          className="w-1/2 h-full object-contain"
          priority
        />
      </div>
    </section>
  );
};

export default Hero;
