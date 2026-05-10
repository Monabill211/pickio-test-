import React from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import imgreview1 from "@/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg";
import imgreview2 from "@/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg";
import imgreview3 from "@/assets/1772015127064_Hce2cacf14490452ab9f4e175e52b0569G.jpg";

export default function ReviewsSection() {
  const { language, isRTL } = useLanguage();

  return (
    <div className="py-20 px-4 bg-gray-50">

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-red-500">
            {isRTL ? '    آراء عملائنا' : 'Our customers opinions'}
      
        </h1>
        <p className="text-gray-500 mt-2">
            {isRTL ? 'شوف الناس بتقول ايه عن' : 'See what people are saying about'}
        Pic<span className="text-red-500">k</span>io
        </p>
      </div>
<div className="flex flex-wrap justify-around " >
<img src={imgreview1} alt="Review 1" className="h-64 object-cover rounded-lg mb-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ease-in-out transition" />
<img src={imgreview2} alt="Review 2" className=" h-64 object-cover rounded-lg mb-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ease-in-out transition" />
<img src={imgreview3} alt="Review 3" className=" h-64 object-cover rounded-lg mb-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1  ease-in-out transition" />

</div>
      
    

  
    </div>
  );
}