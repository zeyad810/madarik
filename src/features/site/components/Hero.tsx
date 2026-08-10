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
          <h1 className="mad-title-1 font-bold text-white">
            نصنع شغف القراءة ونبني عقول المستقبل بلغة الضاد
          </h1>

          <p className="mad-h5 font-normal text-white">
            منصة "مدارك القراءة" التعليمية تقدم لأطفالكم مكتبة رقمية متكاملة تضم
            مئات القصص التفاعلية المصممة بإشراف خبراء لغويين لتطوير مهارات
            القراءة والكتابة بمتعة وأمان.
          </p>

          <div className="flex items-start justify-start gap-[72px]">
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
