"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import imgcherlither from "@/assets/download (2).jpg";
import imgchermash from "@/assets/71tBzZnWREL._AC_SL1500_.jpg";
import imgdesk from "@/assets/Des-Av123-01-700x700.webp";


const OFFERS = [
  {
    image: imgcherlither,
    title: "كرسي جلد فاخر",
    oldPrice: "7,899",
    newPrice: "5,249",
    validUntil: "ساري حتى نفاذ الكمية ",
  },
  {
    image: imgchermash,
    title: "كرسي ماش مودرن",
    oldPrice: "5,450",
    newPrice: "3,690",
    validUntil: "ساري حتى نفاذ الكمية ",
  },
  {
    image: imgdesk,
    title: "مكتب mdf مودرن",
    oldPrice: "22,320",
    newPrice: "17,899",
    validUntil: "ساري حتى نفاذ الكمية ",
  },
];
  

const AUTOPLAY_MS = 10000;

export default function OffersBanneroffice() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % OFFERS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  const offer = OFFERS[current];

  return (
    <section dir="rtl" className="flex justify-center w-full bg-white" style={{ padding: "0 16px 30px" }}>
      <div
        className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden bg-[#faf6ec] flex flex-col sm:flex-row"
        style={{ minHeight: "300px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row w-full"
          >
            {/* صورة المنتج */}
            <div className="relative w-full sm:w-1/2" style={{ minHeight: "220px" }}>
              <img
                src={offer.image}
                alt={offer.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* الشكل الذهبي + النص والسعر */}
            <div className="relative flex-1 flex items-center overflow-hidden">
              <div
                className="absolute inset-0 bg-[#c9a227]"
                style={{ clipPath: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
              />
              <div
                className="relative z-10 flex flex-col w-full"
                style={{ padding: "32px 28px" }}
              >
                <h3
                  className="text-[#1b2438] font-extrabold leading-tight"
                  style={{ fontSize: "1.9rem", transform: "rotate(-3deg)", marginBottom: "16px" }}
                >
              عروض pic<span className="text-red-600">k</span>io Offcie
                </h3>
                <p
                  className="text-[#1b2438] font-semibold text-[1.1rem]"
                  style={{ marginBottom: "10px" }}
                >
                  {offer.title}
                </p>
                <div className="flex items-center" style={{ gap: "10px", marginBottom: "8px" }}>
                  <span className="text-[#7a6a2e] text-[0.85rem] line-through opacity-70">
                    {offer.oldPrice} جنيه
                  </span>
                  <span
                    className="bg-[#8c1d1d] text-white font-bold rounded-md"
                    style={{ padding: "2px 10px", fontSize: "1.05rem" }}
                  >
                    {offer.newPrice} جنيه
                  </span>
                </div>
                <p className="text-[#4a3f1a] text-[0.78rem]" style={{ marginBottom: "20px" }}>
                  {offer.validUntil}
                </p>
                <a
                  href="#"
                  className="inline-block self-start bg-[#df1414] text-white text-[0.85rem] font-semibold rounded-full hover:bg-[#850c0c] transition-colors duration-300"
                  style={{ padding: "10px 26px" }}
                >
                  اشتري الآن
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* نقط المؤشر */}
        <div
          className="absolute z-20 bottom-4 left-4 flex items-center"
          style={{ gap: "6px" }}
        >
          {OFFERS.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "bg-[#1b2438]" : "bg-[#1b2438]/30"
              }`}
              style={{ width: i === current ? "18px" : "6px", height: "6px" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}