import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import { useLanguage } from '@/contexts/LanguageContext';
// styles
import "swiper/css";
import "swiper/css/effect-cards";

const slides = [
   "/src/assets/706719570_122308449224065933_3416807913472693336_n.jpg",
  "/src/assets/710598272_122309399366065933_2595359767439236414_n.jpg",
  "/src/assets/711618782_122309399414065933_8586022679710149126_n.jpg",
  "/src/assets/713143838_122309667944065933_8644064231912972709_n.jpg",
  "/src/assets/719427562_122310209906065933_2441956574877989563_n.jpg",
  "/src/assets/672672882_122303273384065933_8329173405219844069_n.jpg",
  "/src/assets/674301038_122303271692065933_7922314072847471410_n.jpg",
  "/src/assets/678187966_122304058010065933_1575615675827081329_n.jpg",
  "/src/assets/678997188_122304188246065933_1875334157045972524_n.jpg",
  "/src/assets/679347611_122304185234065933_2880443544959681083_n.jpg",
  "/src/assets/680243631_122304188522065933_4617893687329183632_n.jpg",
];

export default function Customers() {
     const { language, isRTL } = useLanguage();
  return (  
    <div className="flex flex-col items-center w-full py-10 px-4 gap-6 md:flex-row md:justify-center md:gap-16">
      
      <div className="text-center max-w-md">
        <h1 className="text-2xl md:text-4xl text-red-600 font-bold mb-4">
             {isRTL ? 'نفذنا مجموعة من مشاريع تجهيز المكاتب لكبرى الشركات المصرية وخارج مصر عن طريق الشحن الدولي معايير الجودة والتصميم.' : 'We have completed a range of office outfitting projects for major Egyptian and international companies via international shipping, adhering to the highest standards of quality and design. '}
        
        </h1>
       
       
      </div>

      <div className="overflow-hidden md:overflow-visible rounded-2xl">
        
        <Swiper
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