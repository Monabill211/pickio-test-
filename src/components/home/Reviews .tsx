"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

const gallery = [
  "/src/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg",
  "/src/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg",
  "/src/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg",
  "/src/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg",
  "/src/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg",
  "/src/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg",
];

export default function GallerySection() {
  return (
    <section
      dir="rtl"
      className=" text-black overflow-hidden"
      style={{
        padding: "120px 20px",
      }}
    >
      {/* Heading */}
      <div
        className="text-center"
        style={{
          marginBottom: "70px",
        }}
      >
        <p className="text-primary tracking-[4px] text-xs font-bold mb-3">
          OUR Reviews
        </p>

        <h2 className="text-4xl md:text-6xl font-black mb-5">
            اراء <span className="text-primary">عملائنا</span>
        </h2>

        <p className="text-black/60 max-w-2xl mx-auto leading-8">
مجموعة من اراء عملائنا عن منتجاتنا وخدماتنا، نحن نقدر كل رأي ونستخدمه لتحسين تجربتكم معنا. نحن ملتزمون بتقديم أفضل جودة وخدمة لعملائنا الكرام.
        </p>
      </div>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={3}
        spaceBetween={30}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2,
          slideShadows: false,
          scale: 0.9,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="gallerySwiper"
      >
        {gallery.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="gallery-card">
              <img src={img} alt="" className="gallery-image" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .gallerySwiper {
          width: 100%;
          padding-bottom: 70px;
        }

        .gallery-card {
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: 0.5s;
          height: 500px;
          background: #111;
        }

        .gallery-card:hover {
          transform: translateY(-10px);
          border-color: rgba(223, 57, 57, 0.4);
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.7s;
        }

        .gallery-card:hover .gallery-image {
          transform: scale(1.08);
        }

        @media (max-width: 768px) {
          .gallery-card {
            height: 350px;
          }
        }
      `}</style>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(223, 57, 57, 0.35) !important;
          opacity: 1 !important;
        }

        .swiper-pagination-bullet-active {
          background: #df3939 !important;
          width: 28px !important;
          border-radius: 999px !important;
        }
      `}</style>
    </section>
  );
}