import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";

// styles
import "swiper/css";
import "swiper/css/effect-cards";

const slides = [
  "https://picsum.photos/300/400?1",
  "https://picsum.photos/300/400?2",
  "https://picsum.photos/300/400?3",
  "https://picsum.photos/300/400?4",
];

export default function Customers() {
  return (  
   <div className="flex flex-col items-center w-full py-10 px-4 gap-6 md:flex-row md:justify-center md:gap-16">
  
  {/* النص */}
  <div className="text-center max-w-md">
    <h1 className="text-2xl md:text-4xl text-red-600 font-bold mb-4">
      اهم عملائنا في المجالات المختلفة
    </h1>
    <p className="text-gray-600 text-sm md:text-lg">
      و تم فرش الشركات من كل شيء
    </p>
  </div>

  {/* السلايدر */}
  <Swiper
    effect="cards"
    grabCursor={true}
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
    }}
    modules={[EffectCards, Autoplay]}
    className="w-full max-w-[260px] h-[340px] md:max-w-[320px] md:h-[420px]"
  >
    {slides.map((img, i) => (
      <SwiperSlide key={i} className="rounded-2xl overflow-hidden">
        <div className="relative w-full h-full">
          
          <img
            src={img}
            className="w-full h-full object-cover"
            alt=""
          />

          <div className="absolute inset-0 bg-black/30" />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

</div>
  );
}