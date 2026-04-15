import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

// styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import heroImagedesk from '@/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg';
import heroImagemeeting from '@/assets/1775992329728_Bespoke_02_2.jpg';
import heroImagehome from '@/assets/hero-living-room.jpg';

const slides = [
  {
    img: heroImagedesk,
    title: "هل تريد اثاث مكتبي مميز؟",
  desc: (
  <>
    مرحبا بك في Pic<span className="text-red-500">k</span>io
  </>

),
link: "/shop?category=9rwTSENuXmJ2gitDCTvf",
  },
  {
    img:heroImagemeeting ,
    title: "هل يوجد طربيزات اجتماعات ",
    desc: "لدينا كل ما تحتاجه من اثاث مكتبي",
    link: "/shop?category=8moIbcIcWaf5CdbJeiRf",
  },
  {
    img: heroImagehome,
    title: "هل تبحث عن اثاث منزلي مميز؟",
    desc: " يوجد لدينا كل ما تحتاجه من المكتبي الي الاثاث منزلي",
    link: "/shop?category=kwRwXDl27eyzAS2pWl4S",
  },
];

export default function HeroPageSilder() {
  return (
    <div className="w-full h-screen">
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-screen">
              
              {/* image */}
              <img
                src={slide.img}
                className="w-full h-full object-cover md:object-cover object-contain"
                alt=""
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <h4 className="text-lg md:text-3xl text-gray-200 mb-6 max-w-xl">
                  {slide.desc}
                </h4>
<Link to={slide.link}>

                <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                 اشتري الان
                </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}