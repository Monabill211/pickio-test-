import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import { useLanguage } from '@/contexts/LanguageContext';
import "swiper/css";
import "swiper/css/effect-cards";
import img1 from "/src/assets/706719570_122308449224065933_3416807913472693336_n.jpg"
import img2 from "/src/assets/710598272_122309399366065933_2595359767439236414_n.jpg"
import img3 from "/src/assets/711618782_122309399414065933_8586022679710149126_n.jpg";
import img4 from "/src/assets/713143838_122309667944065933_8644064231912972709_n.jpg";
import img5 from "/src/assets/719427562_122310209906065933_2441956574877989563_n.jpg";
import img6 from "/src/assets/672672882_122303273384065933_8329173405219844069_n.jpg";
import img7 from "/src/assets/674301038_122303271692065933_7922314072847471410_n.jpg";
import img8 from "/src/assets/678187966_122304058010065933_1575615675827081329_n.jpg";
import img9 from "/src/assets/678997188_122304188246065933_1875334157045972524_n.jpg";
import img10 from "/src/assets/679347611_122304185234065933_2880443544959681083_n.jpg";
import img11 from "/src/assets/680243631_122304188522065933_4617893687329183632_n.jpg";

const slides = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11
];

export default function Customers() {
  const { language, isRTL } = useLanguage();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col items-center w-full py-10 px-4 gap-6 md:flex-row md:justify-center md:gap-16"
    >

      <div className="text-center max-w-md">
        <h1 className="text-2xl md:text-4xl text-red-600 font-bold mb-4">
          {isRTL
            ? 'نفذنا مجموعة من مشاريع تجهيز المكاتب لكبرى الشركات المصرية وخارج مصر عن طريق الشحن الدولي معايير الجودة والتصميم.'
            : 'We have completed a range of office outfitting projects for major Egyptian and international companies via international shipping, adhering to the highest standards of quality and design.'}
        </h1>
      </div>

      <div className="overflow-hidden md:overflow-visible rounded-2xl">

        <Swiper
          key={isRTL ? "rtl" : "ltr"}
          dir={isRTL ? "rtl" : "ltr"}
          effect="cards"
          grabCursor={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[EffectCards, Autoplay]}
          className="w-[260px] h-[340px] md:w-[320px] md:h-[420px]"
        >
          {slides.map((img, i) => (
            <SwiperSlide key={i} className="rounded-2xl overflow-hidden">

              <div className="relative w-full h-full">

                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt={`slide-${i}`}
                />

                <div className="absolute inset-0 bg-black/30" />
              </div>

            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </div>
  );
}