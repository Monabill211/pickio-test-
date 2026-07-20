"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from '@/contexts/LanguageContext';
import { getProductById } from '@/services/productService';
import type { Product } from '@/services/productService';

// الـ IDs الحقيقية بتاعة المنتجات الثلاثة (الجزء اللي بعد آخر _ في كل رابط)
const OFFER_IDS = [
  "BCOvRwP2xebZVQ8iyKap", // ultra-luxury-executive-natural-wood-desk...
  "CB5zySjBq9OQIkWns5ny", // premium-mesh-office-chair...
  "cvBWeb06E4FomYJVXivo", // modern-mdf-meeting-table...
];

const AUTOPLAY_MS = 10000;

// بتبني نفس شكل السلاج اللي صفحة المنتج بتتوقعه: name-slug_id
const buildProductSlug = (product: Product, isRTL: boolean): string => {
  const name = product.name_en || product.name_ar || 'product';
  const slugified = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  return `${slugified}_${product.id}`;
};

export default function OffersBanneroffice() {
  const { isRTL, language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  // نجيب كل منتج بالـ ID بتاعه مباشرة
  const productQueries = OFFER_IDS.map((id) =>
    useQuery({
      queryKey: ['product', id],
      queryFn: () => getProductById(id),
    })
  );

  const isLoading = productQueries.some((q) => q.isLoading);
  const offers = productQueries
    .map((q) => q.data)
    .filter((p): p is Product => Boolean(p));

  useEffect(() => {
    if (offers.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % offers.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [offers.length]);

  const currencyLabel = isRTL ? "جنيه" : "EGP";

  if (isLoading) {
    return (
      <section dir={isRTL ? "rtl" : "ltr"} className="flex justify-center w-full bg-white" style={{ padding: "0 16px 30px" }}>
        <div className="w-full max-w-6xl mx-auto rounded-2xl bg-[#faf6ec] flex items-center justify-center" style={{ minHeight: "300px" }}>
          <span className="text-muted-foreground text-sm">
            {isRTL ? "جاري تحميل العروض..." : "Loading offers..."}
          </span>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  const offer = offers[current] || offers[0];
  const offerName = isRTL ? offer.name_ar : offer.name_en;
  const offerImage = offer.images?.[0] || '/placeholder.svg';
  const offerOldPrice = offer.originalPrice || offer.discountPrice;
  const offerNewPrice = offer.price;
  const offerSlug = buildProductSlug(offer, isRTL);

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="flex justify-center w-full bg-white" style={{ padding: "0 16px 30px" }}>
      <div
        className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden bg-[#faf6ec] flex flex-col sm:flex-row"
        style={{ minHeight: "300px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={offer.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row w-full"
          >
            {/* صورة المنتج */}
            <div className="relative w-full sm:w-1/2" style={{ minHeight: "220px" }}>
              <img
                src={offerImage}
                alt={offerName}
                className="absolute inset-0 w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>

            {/* الشكل الذهبي + النص والسعر */}
            <div className="relative flex-1 flex items-center overflow-hidden">
              <div
                className="absolute inset-0 bg-[#c9a227]"
                style={{ clipPath: isRTL ? "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 0%, 82% 0%, 100% 100%, 0% 100%)" }}
              />
              <div
                className="relative z-10 flex flex-col w-full"
                style={{ padding: "32px 28px" }}
              >
                <h3
                  className="text-[#1b2438] font-extrabold leading-tight"
                  style={{ fontSize: "1.9rem", transform: "rotate(-3deg)", marginBottom: "16px" }}
                >
                  {isRTL ? (
                    <>عروض pic<span className="text-red-600">k</span>io Office</>
                  ) : (
                    <>Pic<span className="text-red-600">k</span>io Office Offers</>
                  )}
                </h3>
                <p
                  className="text-[#1b2438] font-semibold text-[1.1rem]"
                  style={{ marginBottom: "10px" }}
                >
                  {offerName}
                </p>
                <div className="flex items-center" style={{ gap: "10px", marginBottom: "8px" }}>
                  {offerOldPrice && offerOldPrice > offerNewPrice && (
                    <span className="text-[#7a6a2e] text-[0.85rem] line-through opacity-70">
                      {offerOldPrice.toLocaleString()} {currencyLabel}
                    </span>
                  )}
                       <span className="text-[#7a6a2e] text-[0.85rem] line-through opacity-70">
                    {offer.originalPrice} {currencyLabel}
                  </span>
                  <span
                    className="bg-[#8c1d1d] text-white font-bold rounded-md"
                    style={{ padding: "2px 10px", fontSize: "1.05rem" }}
                  >
                    {offerNewPrice.toLocaleString()} {currencyLabel}
                  </span>
                </div>
                <p className="text-[#4a3f1a] text-[0.78rem]" style={{ marginBottom: "20px" }}>
                  {isRTL ? "ساري حتى نفاذ الكمية" : "Valid while stocks last"}
                </p>
                <Link
                  to={`/product/${offerSlug}`}
                  className="inline-block self-start bg-[#df1414] text-white text-[0.85rem] font-semibold rounded-full hover:bg-[#850c0c] transition-colors duration-300"
                  style={{ padding: "10px 26px" }}
                >
                  {isRTL ? "اشتري الآن" : "Shop Now"}
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* نقط المؤشر */}
        <div
          className="absolute z-20 bottom-4 flex items-center"
          style={{ gap: "6px", ...(isRTL ? { left: "16px" } : { right: "16px" }) }}
        >
          {offers.map((_, i) => (
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