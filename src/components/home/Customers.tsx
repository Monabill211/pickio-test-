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
    <>
    <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl text-red-600 font-bold">
           بعض من علامئنا الكرام
        </h1>
        <h2 className="text-lg md:text-2xl text-[#00bacf] mt-3">
       هذا شرف لنا
        </h2>
      </div>
    <div className="flex justify-center flex-col md:flex-row items-center w-full py-10">
    <div>
        <h1 className="text-3xl md:text-4xl text-red-600 font-bold text-center" style={{margin:"15px"}}>
            اهم عملائنا في المجالات المختلفة
            <br />
             و تم فرش الشركات من كل شيء</h1>
      </div>
      <Swiper
        effect="cards"
        grabCursor={true}
        autoplay={{
          delay: 2000, // 🔥 كل 3 ثواني
          disableOnInteraction: false,
        }}
        modules={[EffectCards, Autoplay]}
        className="w-[250px] h-[350px] md:w-[300px] md:h-[400px] overflow-hidden"
      >
        {slides.map((img, i) => (
          <SwiperSlide key={i} className="rounded-2xl overflow-hidden">
            
            <div className="relative w-full h-full">
              
              <img
                src={img}
                className="w-full h-full object-cover"
                alt=""
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* text */}
      

            </div>

          </SwiperSlide>
        ))}
      </Swiper>

    </div>
    </>
  );
}