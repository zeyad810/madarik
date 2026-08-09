import Image from "next/image";
import background from "../../../public/iamges/Header/header_background.png";
import side from "../../../public/iamges/Header/side_image.png";

const Header = () => {
  return (
    <section
      className="h-screen bg-cover bg-center bg-no-repeat flex items-center px-10"
      style={{
        backgroundImage: `url(${background.src})`,
      }}
    >
      <div className="w-2/3 flex items-center justify-start flex-col gap-5">
        <h1 className=" text-white text-7xl font-bold ">
          نصنع شغف القراءة ونبني عقول المستقبل بلغة الضاد
        </h1>

        <p className="text-white font-normal text-2xl">
          منصة "مدارك القراءة" التعليمية تقدم لأطفالكم مكتبة رقمية متكاملة تضم
          مئات القصص التفاعلية المصممة بإشراف خبراء لغويين لتطوير مهارات القراءة
          والكتابة بمتعة وأمان.
        </p>

        <div className="flex items-center justify-start">
            <p className="text-third font-bold text-3xl">
                5 - 15 سنة
            </p>
        </div>
      </div>
      
      {/* <div className="w-1/3"> */}
        <Image
          src={side}
          alt=""
          className="w-1/2 h-full object-contain"
          priority
        />
      {/* </div> */}
    </section>
  );
};

export default Header;
